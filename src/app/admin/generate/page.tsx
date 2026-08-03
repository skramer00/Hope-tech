"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import "../admin.css";
import "./generate.css";

type Block = {
  type: "callout" | "steps" | "warning" | "tip" | "text";
  tone?: string;
  title?: string;
  text?: string;
  items?: string[];
};

type DraftGuide = {
  title: string;
  slug: string;
  summary: string;
  role_key: string;
  safety_level: "volunteer_safe" | "technical_lead" | "admin_only";
  body: { blocks: Block[] };
};

export default function GenerateGuidePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [role, setRole] = useState("switcher");
  const [equipment, setEquipment] = useState("");
  const [task, setTask] = useState("");
  const [context, setContext] = useState("");
  const [audience, setAudience] = useState("Volunteer with little or no prior experience");
  const [draft, setDraft] = useState<DraftGuide | null>(null);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [savedSlug, setSavedSlug] = useState("");

  useEffect(() => {
    async function checkAccess() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (!data.session) {
        setAuthorized(false);
        return;
      }
      const { data: profileData } = await supabase.rpc("get_my_admin_profile");
      const profile = Array.isArray(profileData) ? profileData[0] : null;
      setAuthorized(Boolean(profile && ["admin", "editor"].includes(profile.role)));
    }
    void checkAccess();
  }, []);

  async function generate(event: FormEvent) {
    event.preventDefault();
    if (!session) return;
    setWorking(true);
    setDraft(null);
    setSavedSlug("");
    setMessage("Generating an unverified draft for review…");

    const response = await fetch("/api/admin/generate-guide", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ role, equipment, task, context, audience }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "The guide could not be generated.");
      setWorking(false);
      return;
    }
    setDraft(data.guide as DraftGuide);
    setMessage("Draft generated. Review every instruction before saving or publishing.");
    setWorking(false);
  }

  async function saveDraft() {
    if (!draft || !session) return;
    setWorking(true);
    setMessage("Saving draft…");
    let slug = draft.slug;
    let result = await supabase.from("content_items").insert({
      ...draft,
      slug,
      content_type: "guide",
      status: "draft",
      created_by: session.user.id,
      updated_by: session.user.id,
    }).select("slug").single();

    if (result.error?.code === "23505") {
      slug = `${draft.slug}-${Date.now().toString().slice(-6)}`;
      result = await supabase.from("content_items").insert({
        ...draft,
        slug,
        content_type: "guide",
        status: "draft",
        created_by: session.user.id,
        updated_by: session.user.id,
      }).select("slug").single();
    }

    if (result.error) {
      setMessage(result.error.message);
      setWorking(false);
      return;
    }
    setSavedSlug(result.data.slug);
    setMessage("Saved as a draft. It is not visible to volunteers until an admin reviews and publishes it.");
    setWorking(false);
  }

  if (authorized === null) return <main className="wrap section"><p>Checking administrator access…</p></main>;
  if (!authorized) return <main className="wrap section"><p className="eyebrow">Admin access required</p><h1>Sign in through the Admin Portal first.</h1><Link className="button primary" href="/admin">Open Admin Portal</Link></main>;

  return <main className="generator-page">
    <header className="generator-header">
      <div><p className="eyebrow">Hope Tech Administration</p><h1>Generate a guide draft</h1><p>AI creates the first pass. A Hope Tech administrator verifies, edits, and publishes it.</p></div>
      <Link className="button secondary" href="/admin">Back to Admin</Link>
    </header>

    <div className="generator-grid">
      <form className="generator-form" onSubmit={generate}>
        <div className="review-warning"><strong>Draft only</strong><p>Do not publish until every local control, source, workflow, and safety instruction has been confirmed.</p></div>
        <div className="form-row">
          <label>Role or area<select value={role} onChange={(event) => setRole(event.target.value)}><option value="switcher">Switcher</option><option value="camera">Camera</option><option value="propresenter">ProPresenter</option><option value="audio">Audio</option><option value="lighting">Lighting</option><option value="livestream">Livestream</option><option value="intercom">Intercom</option><option value="general">General</option></select></label>
          <label>Equipment or system<input value={equipment} onChange={(event) => setEquipment(event.target.value)} placeholder="Example: Blackmagic ATEM 2 M/E"/></label>
        </div>
        <label>What guide should be created?<textarea required rows={4} value={task} onChange={(event) => setTask(event.target.value)} placeholder="Example: Quick recovery guide for when the director loses the next camera shot."/></label>
        <label>Hope-specific setup and facts<textarea rows={8} value={context} onChange={(event) => setContext(event.target.value)} placeholder="Include actual input assignments, approved workflow, what volunteers may touch, when to escalate, and any terminology used at Hope. The AI is instructed not to invent missing details."/></label>
        <label>Intended reader<input value={audience} onChange={(event) => setAudience(event.target.value)}/></label>
        <button className="admin-primary generate-button" type="submit" disabled={working || !task.trim()}>{working ? "Working…" : "Generate draft"}</button>
        {message && <p className="generator-message">{message}</p>}
      </form>

      <section className="draft-preview">
        {!draft ? <div className="empty-preview"><span>AI</span><h2>Your structured draft will appear here.</h2><p>It will include a quick answer, practical steps, warnings, tips, and escalation guidance where appropriate.</p></div> : <>
          <div className="draft-heading"><div><p className="eyebrow">Unverified AI draft</p><h2>{draft.title}</h2><p>{draft.summary}</p></div><span>{draft.safety_level.replaceAll("_", " ")}</span></div>
          <div className="draft-blocks">{draft.body.blocks.map((block, index) => <article className={`draft-block ${block.type}`} key={`${block.type}-${index}`}><small>{block.type}</small><h3>{block.title}</h3>{block.type === "steps" ? <ol>{(block.items ?? []).map((item) => <li key={item}>{item}</li>)}</ol> : <p>{block.text}</p>}</article>)}</div>
          <div className="draft-actions"><button className="admin-primary" onClick={saveDraft} disabled={working || Boolean(savedSlug)}>Save to Admin as draft</button>{savedSlug && <Link className="button secondary" href={`/admin?edit=${savedSlug}`}>Review in wiki editor</Link>}</div>
        </>}
      </section>
    </div>
  </main>;
}
