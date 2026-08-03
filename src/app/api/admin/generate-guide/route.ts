import { NextRequest, NextResponse } from "next/server";

type GeneratedBlock = {
  type: "callout" | "steps" | "warning" | "tip" | "text";
  tone: "safe" | "urgent" | "info" | null;
  title: string;
  text: string | null;
  items: string[];
};

type GeneratedGuide = {
  title: string;
  slug: string;
  summary: string;
  role_key: string;
  safety_level: "volunteer_safe" | "technical_lead" | "admin_only";
  blocks: GeneratedBlock[];
};

const guideSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "slug", "summary", "role_key", "safety_level", "blocks"],
  properties: {
    title: { type: "string" },
    slug: { type: "string" },
    summary: { type: "string" },
    role_key: { type: "string" },
    safety_level: {
      type: "string",
      enum: ["volunteer_safe", "technical_lead", "admin_only"],
    },
    blocks: {
      type: "array",
      minItems: 4,
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["type", "tone", "title", "text", "items"],
        properties: {
          type: {
            type: "string",
            enum: ["callout", "steps", "warning", "tip", "text"],
          },
          tone: {
            anyOf: [
              { type: "string", enum: ["safe", "urgent", "info"] },
              { type: "null" },
            ],
          },
          title: { type: "string" },
          text: { anyOf: [{ type: "string" }, { type: "null" }] },
          items: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Sign in is required." }, { status: 401 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
    }

    const profileResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/get_my_admin_profile`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: "{}",
      cache: "no-store",
    });

    if (!profileResponse.ok) {
      return NextResponse.json({ error: "Administrator access could not be verified." }, { status: 403 });
    }

    const profiles = (await profileResponse.json()) as Array<{ role?: string }>;
    if (!profiles[0] || !["admin", "editor"].includes(profiles[0].role ?? "")) {
      return NextResponse.json({ error: "Administrator or editor access is required." }, { status: 403 });
    }

    const body = await request.json();
    const role = String(body.role ?? "general").trim();
    const equipment = String(body.equipment ?? "").trim();
    const task = String(body.task ?? "").trim();
    const context = String(body.context ?? "").trim();
    const audience = String(body.audience ?? "Volunteer with little or no prior experience").trim();

    if (!task) return NextResponse.json({ error: "Describe the guide you want to create." }, { status: 400 });
    if (task.length > 4000 || context.length > 8000) {
      return NextResponse.json({ error: "The guide request is too long." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI generation is built but OPENAI_API_KEY has not been added to Vercel yet." },
        { status: 503 },
      );
    }

    const model = process.env.OPENAI_MODEL || "gpt-5";
    const prompt = `Create a quick-start operational guide for Hope Technical Ministries.

Role: ${role}
Equipment/system: ${equipment || "Not specified"}
Audience: ${audience}
Task or guide requested: ${task}
Hope-specific setup and facts supplied by the administrator:
${context || "No additional local details supplied."}

Requirements:
- This is not a manufacturer manual. It is a concise guide for a volunteer operating an already configured church system.
- Use only the Hope-specific facts supplied above. Do not invent input numbers, button labels, wiring, credentials, equipment models, safety procedures, or local workflow.
- When a necessary local detail is missing, explicitly mark it as needing administrator confirmation.
- Start with a direct quick answer, then practical steps, warnings, best practices, and recovery/escalation guidance when useful.
- Distinguish volunteer-safe actions from actions that require a technical lead.
- Use plain language and short steps that can be followed during a live service.
- The output is a draft for human review and must not claim to be verified.
- Choose a simple lowercase URL slug using hyphens.
- Return 4 to 10 structured blocks. Steps blocks use items; other blocks use text. Use an empty items array for non-step blocks and null text for step blocks.`;

    const aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions:
          "You write accurate, concise church technical-ministry quick-start guides. Never invent local configuration details. Every output is an unverified admin draft.",
        input: prompt,
        text: {
          format: {
            type: "json_schema",
            name: "hope_tech_guide",
            description: "A structured Hope Tech guide draft for administrator review.",
            strict: true,
            schema: guideSchema,
          },
        },
      }),
      cache: "no-store",
    });

    const aiData = await aiResponse.json();
    if (!aiResponse.ok) {
      const message = aiData?.error?.message || "The AI service could not generate the guide.";
      return NextResponse.json({ error: message }, { status: aiResponse.status });
    }

    const outputText = extractOutputText(aiData);
    if (!outputText) return NextResponse.json({ error: "The AI response did not contain a guide." }, { status: 502 });

    const generated = JSON.parse(outputText) as GeneratedGuide;
    const normalized = normalizeGuide(generated, role);
    return NextResponse.json({ guide: normalized });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Guide generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function extractOutputText(data: any): string {
  if (typeof data?.output_text === "string") return data.output_text;
  for (const item of data?.output ?? []) {
    if (item?.type !== "message") continue;
    for (const content of item?.content ?? []) {
      if (content?.type === "output_text" && typeof content.text === "string") return content.text;
    }
  }
  return "";
}

function normalizeGuide(guide: GeneratedGuide, requestedRole: string) {
  const slug = (guide.slug || guide.title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

  return {
    title: guide.title.trim(),
    slug: slug || `guide-${Date.now()}`,
    summary: guide.summary.trim(),
    role_key: guide.role_key.trim() || requestedRole || "general",
    safety_level: guide.safety_level,
    body: {
      blocks: guide.blocks.map((block) => ({
        type: block.type,
        ...(block.type === "callout" ? { tone: block.tone || "info" } : {}),
        title: block.title.trim(),
        ...(block.type === "steps"
          ? { items: block.items.map((item) => item.trim()).filter(Boolean) }
          : { text: (block.text || "").trim() }),
      })),
    },
  };
}
