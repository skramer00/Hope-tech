"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./guide.css";

type Block = {
  type: "callout" | "steps" | "warning" | "tip" | "text";
  tone?: string;
  title?: string;
  text?: string;
  items?: string[];
};

type Guide = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  role_key: string | null;
  safety_level: string;
  body: { blocks?: Block[] };
};

export default function GuidePage() {
  const params = useParams<{ slug: string }>();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGuide() {
      setLoading(true);
      const { data, error: queryError } = await supabase
        .from("content_items")
        .select("id,title,slug,summary,role_key,safety_level,body")
        .eq("slug", params.slug)
        .eq("status", "published")
        .single();
      if (queryError) setError("This guide is not available yet.");
      else setGuide(data as Guide);
      setLoading(false);
    }
    if (params.slug) loadGuide();
  }, [params.slug]);

  if (loading) return <main className="wrap section"><p>Loading guide…</p></main>;
  if (!guide) return <main className="wrap section"><p className="eyebrow">Guide unavailable</p><h1>{error}</h1><Link className="button secondary" href="/">Return home</Link></main>;

  return <main className="wrap section guide-page">
    <div className="guide-heading">
      <div>
        <p className="eyebrow">{label(guide.role_key || "Hope Tech")} · Live content</p>
        <h1>{guide.title}</h1>
        {guide.summary && <p className="lead">{guide.summary}</p>}
      </div>
      <div className={`guide-safety ${guide.safety_level}`}><small>Safety level</small><strong>{label(guide.safety_level)}</strong></div>
    </div>

    <div className="guide-blocks">
      {(guide.body.blocks ?? []).map((block, index) => <GuideBlock key={`${block.type}-${index}`} block={block}/>) }
    </div>

    <div className="guide-footer-actions">
      <Link className="button secondary" href={guide.role_key ? `/${guide.role_key}` : "/"}>Back to role guide</Link>
      <Link className="button primary" href={`/admin?edit=${guide.slug}`}>Edit this page</Link>
    </div>
  </main>;
}

function GuideBlock({ block }: { block: Block }) {
  if (block.type === "steps") return <section className="guide-block steps-block"><p className="eyebrow">Procedure</p>{block.title && <h2>{block.title}</h2>}<ol>{(block.items ?? []).map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}</ol></section>;
  if (block.type === "warning") return <section className="guide-block warning-block"><p className="eyebrow">Warning</p>{block.title && <h2>{block.title}</h2>}<p>{block.text}</p></section>;
  if (block.type === "tip") return <section className="guide-block tip-block"><p className="eyebrow">Best practice</p>{block.title && <h2>{block.title}</h2>}<p>{block.text}</p></section>;
  if (block.type === "callout") return <section className={`guide-block callout-block ${block.tone ?? ""}`}><p className="eyebrow">Quick answer</p>{block.title && <h2>{block.title}</h2>}<p>{block.text}</p></section>;
  return <section className="guide-block"><h2>{block.title}</h2><p>{block.text}</p></section>;
}

function label(value: string) {
  return value.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
