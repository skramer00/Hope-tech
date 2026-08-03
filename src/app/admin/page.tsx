"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import "./admin.css";

type BlockType = "callout" | "steps" | "warning" | "tip" | "text";
type ContentBlock = { type: BlockType; tone?: string; title?: string; text?: string; items?: string[] };
type ContentItem = {
  id: string; title: string; slug: string;
  content_type: "role" | "guide" | "troubleshooting" | "assistant" | "media" | "setting";
  role_key: string | null; summary: string | null; body: { blocks?: ContentBlock[] };
  safety_level: "volunteer_safe" | "technical_lead" | "admin_only";
  status: "draft" | "published" | "archived"; updated_at: string;
};
type Profile = { id: string; email: string | null; display_name: string | null; role: "admin" | "editor" | "viewer" };

const sections = ["Overview", "Content", "Roles & Devices", "Assistant Knowledge", "Media", "Settings"];
const emptyItem: Omit<ContentItem, "id" | "updated_at"> = { title: "Untitled guide", slug: "", content_type: "guide", role_key: "switcher", summary: "", body: { blocks: [] }, safety_level: "volunteer_safe", status: "draft" };

export default function AdminPage() {
  const searchParams = useSearchParams();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState("");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [message, setMessage] = useState("");

  const loadItems = useCallback(async () => {
    const { data, error } = await supabase.from("content_items").select("*").order("sort_order").order("updated_at", { ascending: false });
    if (error) setMessage(error.message); else setItems((data ?? []) as ContentItem[]);
  }, []);

  const loadAccess = useCallback(async (nextSession: Session | null) => {
    setLoading(true); setAccessError(""); setSession(nextSession);
    if (!nextSession?.user) { setProfile(null); setLoading(false); return; }
    const { data, error } = await supabase.rpc("get_my_admin_profile");
    if (error) { setProfile(null); setAccessError(error.message); setLoading(false); return; }
    const nextProfile = Array.isArray(data) ? data[0] : null;
    setProfile((nextProfile ?? null) as Profile | null);
    if (nextProfile && ["admin", "editor"].includes(nextProfile.role)) await loadItems();
    setLoading(false);
  }, [loadItems]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => { if (mounted) void loadAccess(data.session); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => { if (mounted) void loadAccess(nextSession); });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, [loadAccess]);

  useEffect(() => {
    const editSlug = searchParams.get("edit");
    if (editSlug && items.length) {
      const match = items.find((item) => item.slug === editSlug);
      if (match) { setSelected(match); setActive("Content"); }
    }
  }, [items, searchParams]);

  const filtered = useMemo(() => {
    const sectionType = active === "Roles & Devices" ? "role" : active === "Assistant Knowledge" ? "assistant" : active === "Media" ? "media" : null;
    return items.filter((item) => (!sectionType || item.content_type === sectionType) && `${item.title} ${item.content_type} ${item.role_key ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  }, [items, query, active]);
  const counts = { published: items.filter(i => i.status === "published").length, drafts: items.filter(i => i.status === "draft").length, safe: items.filter(i => i.safety_level === "volunteer_safe").length, lead: items.filter(i => i.safety_level !== "volunteer_safe").length };

  async function createDraft() {
    const slug = `untitled-${Date.now()}`;
    const { data, error } = await supabase.from("content_items").insert({ ...emptyItem, slug, created_by: session?.user.id, updated_by: session?.user.id }).select("*").single();
    if (error) return setMessage(error.message);
    const created = data as ContentItem; setItems(c => [created, ...c]); setSelected(created); setActive("Content");
  }

  async function saveSelected() {
    if (!selected) return;
    const cleanSlug = selected.slug || selected.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { data, error } = await supabase.from("content_items").update({ title: selected.title, slug: cleanSlug, content_type: selected.content_type, role_key: selected.role_key || null, summary: selected.summary, body: selected.body, safety_level: selected.safety_level, status: selected.status, updated_by: session?.user.id }).eq("id", selected.id).select("*").single();
    if (error) return setMessage(error.message);
    setItems(c => c.map(i => i.id === selected.id ? data as ContentItem : i)); setSelected(null); setMessage("Content saved.");
  }

  if (loading) return <main className="wrap section"><p>Checking Hope Tech administrator access…</p></main>;
  if (!session) return <AdminLogin />;
  if (!profile || !["admin", "editor"].includes(profile.role)) return <main className="wrap section"><p className="eyebrow">Access restricted</p><h1>This account does not have admin access.</h1><p>Signed in as <strong>{session.user.email}</strong>.</p>{accessError && <p>Role lookup error: {accessError}</p>}<div className="button-row"><button className="button primary" onClick={() => void loadAccess(session)}>Check access again</button><button className="button secondary" onClick={() => supabase.auth.signOut()}>Sign out</button></div></main>;

  return <main className="admin-page">
    <aside className="admin-sidebar"><Link href="/" className="admin-brand"><span>HT</span><div><strong>Hope Tech</strong><small>Administration</small></div></Link><nav>{sections.map(section => <button key={section} className={active === section ? "active" : ""} onClick={() => setActive(section)}>{section}</button>)}</nav><div className="admin-sidebar-note"><strong>Connected as {profile.role}</strong><span className="setup-dot"/> Supabase persistence active</div><button className="return-link" onClick={() => supabase.auth.signOut()}>Sign out</button><Link href="/" className="return-link">Return to volunteer site</Link></aside>
    <section className="admin-main"><header className="admin-header"><div><p className="eyebrow">Admin portal · {profile.display_name || profile.email}</p><h1>{active}</h1></div><button className="admin-primary" onClick={createDraft}>+ New content</button></header>{message && <div className="admin-notice"><div><strong>{message}</strong></div><button onClick={() => setMessage("")}>×</button></div>}
      {active === "Overview" ? <><div className="admin-notice"><div><strong>Live content management is active.</strong><p>Create structured guides and publish changes without a deployment.</p></div><span>LIVE</span></div><div className="metric-grid"><article><small>Published</small><strong>{counts.published}</strong><p>Live volunteer resources</p></article><article><small>Drafts</small><strong>{counts.drafts}</strong><p>Waiting for review</p></article><article><small>Volunteer safe</small><strong>{counts.safe}</strong><p>Immediate actions</p></article><article><small>Lead only</small><strong>{counts.lead}</strong><p>Escalated procedures</p></article></div><section className="admin-panel"><div className="panel-title"><div><p className="eyebrow">Recent content</p><h2>Keep guidance current.</h2></div><button onClick={() => setActive("Content")}>View all</button></div><ContentTable items={items.slice(0, 6)} onSelect={setSelected}/></section></> : <section className="admin-panel content-manager"><div className="panel-title"><div><p className="eyebrow">Content library</p><h2>{active}</h2></div><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search content"/></div><ContentTable items={filtered} onSelect={setSelected}/></section>}
    </section>
    {selected && <Editor item={selected} setItem={setSelected} onClose={() => setSelected(null)} onSave={saveSelected}/>} 
  </main>;
}

function AdminLogin() {
  const [email, setEmail] = useState("scott.skweb@gmail.com"); const [password, setPassword] = useState(""); const [message, setMessage] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); setMessage("Signing in…"); const result = await supabase.auth.signInWithPassword({ email, password }); setMessage(result.error ? result.error.message : "Signed in. Checking administrator access…"); }
  return <main className="wrap section"><div className="admin-login-card"><p className="eyebrow">Hope Tech administration</p><h1>Sign in</h1><p>Use the approved administrator account.</p><form onSubmit={submit}><label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)}/></label><label>Password<input type="password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)}/></label><button className="admin-primary" type="submit">Sign in</button></form>{message && <p>{message}</p>}</div></main>;
}

function Editor({ item, setItem, onClose, onSave }: { item: ContentItem; setItem: (item: ContentItem) => void; onClose: () => void; onSave: () => void }) {
  const blocks = item.body.blocks ?? [];
  function setBlocks(next: ContentBlock[]) { setItem({ ...item, body: { ...item.body, blocks: next } }); }
  function addBlock(type: BlockType) { const block: ContentBlock = type === "steps" ? { type, title: "Procedure", items: [""] } : type === "callout" ? { type, tone: "safe", title: "Quick answer", text: "" } : { type, title: type === "warning" ? "Warning" : type === "tip" ? "Best practice" : "Section title", text: "" }; setBlocks([...blocks, block]); }
  function updateBlock(index: number, patch: Partial<ContentBlock>) { setBlocks(blocks.map((block, i) => i === index ? { ...block, ...patch } : block)); }
  function moveBlock(index: number, direction: -1 | 1) { const target = index + direction; if (target < 0 || target >= blocks.length) return; const next = [...blocks]; [next[index], next[target]] = [next[target], next[index]]; setBlocks(next); }
  function removeBlock(index: number) { setBlocks(blocks.filter((_, i) => i !== index)); }

  return <div className="editor-backdrop" onClick={onClose}><aside className="editor-drawer" onClick={e => e.stopPropagation()}><div className="editor-header"><div><p className="eyebrow">Content editor</p><h2>{item.title}</h2></div><button onClick={onClose}>×</button></div>
    <label>Title<input value={item.title} onChange={e => setItem({ ...item, title: e.target.value })}/></label><label>URL slug<input value={item.slug} onChange={e => setItem({ ...item, slug: e.target.value })}/></label>
    <div className="editor-row"><label>Type<select value={item.content_type} onChange={e => setItem({ ...item, content_type: e.target.value as ContentItem["content_type"] })}><option value="role">Role</option><option value="guide">Guide</option><option value="troubleshooting">Troubleshooting</option><option value="assistant">Assistant Answer</option><option value="media">Media</option><option value="setting">Setting</option></select></label><label>Role<select value={item.role_key ?? ""} onChange={e => setItem({ ...item, role_key: e.target.value })}><option value="switcher">Switcher</option><option value="camera">Camera</option><option value="propresenter">ProPresenter</option><option value="audio">Audio</option><option value="lighting">Lighting</option><option value="">General</option></select></label></div>
    <div className="editor-row"><label>Status<select value={item.status} onChange={e => setItem({ ...item, status: e.target.value as ContentItem["status"] })}><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label><label>Safety level<select value={item.safety_level} onChange={e => setItem({ ...item, safety_level: e.target.value as ContentItem["safety_level"] })}><option value="volunteer_safe">Volunteer Safe</option><option value="technical_lead">Technical Lead</option><option value="admin_only">Administrator Only</option></select></label></div>
    <label>Summary<textarea rows={4} value={item.summary ?? ""} onChange={e => setItem({ ...item, summary: e.target.value })}/></label>
    <section className="block-editor"><div className="block-editor-heading"><div><strong>Guide blocks</strong><small>{blocks.length} block{blocks.length === 1 ? "" : "s"}</small></div></div>
      {blocks.length === 0 && <p className="empty-blocks">Add a block to build the volunteer-facing guide.</p>}
      {blocks.map((block, index) => <article className="block-card" key={`${block.type}-${index}`}><header><span>{index + 1}. {label(block.type)}</span><div><button onClick={() => moveBlock(index, -1)} disabled={index === 0}>↑</button><button onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1}>↓</button><button className="delete-block" onClick={() => removeBlock(index)}>Delete</button></div></header><label>Heading<input value={block.title ?? ""} onChange={e => updateBlock(index, { title: e.target.value })}/></label>{block.type === "callout" && <label>Tone<select value={block.tone ?? "safe"} onChange={e => updateBlock(index, { tone: e.target.value })}><option value="safe">Safe / green</option><option value="urgent">Urgent / red</option><option value="info">Information</option></select></label>}{block.type === "steps" ? <StepItems items={block.items ?? []} onChange={items => updateBlock(index, { items })}/> : <label>Text<textarea rows={3} value={block.text ?? ""} onChange={e => updateBlock(index, { text: e.target.value })}/></label>}</article>)}
      <div className="add-blocks"><button onClick={() => addBlock("callout")}>+ Quick answer</button><button onClick={() => addBlock("steps")}>+ Steps</button><button onClick={() => addBlock("warning")}>+ Warning</button><button onClick={() => addBlock("tip")}>+ Tip</button><button onClick={() => addBlock("text")}>+ Text</button></div>
    </section>
    <div className="editor-actions"><button className="secondary-admin" onClick={onClose}>Cancel</button>{item.status === "published" && <Link className="secondary-admin preview-link" href={`/guides/${item.slug}`} target="_blank">Preview</Link>}<button className="admin-primary" onClick={onSave}>Save</button></div>
  </aside></div>;
}

function StepItems({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  return <div className="step-item-editor"><strong>Steps</strong>{items.map((item, index) => <div key={index}><span>{index + 1}</span><textarea rows={2} value={item} onChange={e => onChange(items.map((v, i) => i === index ? e.target.value : v))}/><button onClick={() => onChange(items.filter((_, i) => i !== index))}>×</button></div>)}<button className="add-step" onClick={() => onChange([...items, ""])}>+ Add step</button></div>;
}

function ContentTable({ items, onSelect }: { items: ContentItem[]; onSelect: (item: ContentItem) => void }) { return <div className="content-table"><div className="content-row content-head"><span>Title</span><span>Type</span><span>Role</span><span>Safety</span><span>Status</span></div>{items.map(item => <button className="content-row" key={item.id} onClick={() => onSelect(item)}><span><strong>{item.title}</strong><small>Updated {new Date(item.updated_at).toLocaleDateString()}</small></span><span>{label(item.content_type)}</span><span>{label(item.role_key || "general")}</span><span><i className={item.safety_level === "volunteer_safe" ? "safe-indicator" : "lead-indicator"}/>{label(item.safety_level)}</span><span className={item.status === "published" ? "published-pill" : "draft-pill"}>{label(item.status)}</span></button>)}</div>; }
function label(value: string) { return value.split("_").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" "); }
