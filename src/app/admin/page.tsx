"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import "./admin.css";

type ContentItem = {
  id: string;
  title: string;
  slug: string;
  content_type: "role" | "guide" | "troubleshooting" | "assistant" | "media" | "setting";
  role_key: string | null;
  summary: string | null;
  body: { blocks?: Array<{ type: string; text: string }> };
  safety_level: "volunteer_safe" | "technical_lead" | "admin_only";
  status: "draft" | "published" | "archived";
  updated_at: string;
};

type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: "admin" | "editor" | "viewer";
};

const sections = ["Overview", "Content", "Roles & Devices", "Assistant Knowledge", "Media", "Settings"];
const emptyItem: Omit<ContentItem, "id" | "updated_at"> = {
  title: "Untitled guide",
  slug: "",
  content_type: "guide",
  role_key: "switcher",
  summary: "",
  body: { blocks: [] },
  safety_level: "volunteer_safe",
  status: "draft",
};

export default function AdminPage() {
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
    const { data, error } = await supabase
      .from("content_items")
      .select("*")
      .order("sort_order")
      .order("updated_at", { ascending: false });
    if (error) setMessage(error.message);
    else setItems((data ?? []) as ContentItem[]);
  }, []);

  const loadAccess = useCallback(async (nextSession: Session | null) => {
    setLoading(true);
    setAccessError("");
    setSession(nextSession);

    if (!nextSession?.user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.rpc("get_my_admin_profile");
    if (error) {
      setProfile(null);
      setAccessError(error.message);
      setLoading(false);
      return;
    }

    const nextProfile = Array.isArray(data) ? data[0] : null;
    setProfile((nextProfile ?? null) as Profile | null);

    if (nextProfile && ["admin", "editor"].includes(nextProfile.role)) {
      await loadItems();
    }
    setLoading(false);
  }, [loadItems]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) void loadAccess(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) void loadAccess(nextSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [loadAccess]);

  const filtered = useMemo(() => {
    const sectionType = active === "Roles & Devices" ? "role" : active === "Assistant Knowledge" ? "assistant" : active === "Media" ? "media" : null;
    return items.filter((item) => (!sectionType || item.content_type === sectionType) && `${item.title} ${item.content_type} ${item.role_key ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  }, [items, query, active]);

  const counts = {
    published: items.filter((item) => item.status === "published").length,
    drafts: items.filter((item) => item.status === "draft").length,
    safe: items.filter((item) => item.safety_level === "volunteer_safe").length,
    lead: items.filter((item) => item.safety_level !== "volunteer_safe").length,
  };

  async function createDraft() {
    const slug = `untitled-${Date.now()}`;
    const { data, error } = await supabase.from("content_items").insert({ ...emptyItem, slug, created_by: session?.user.id, updated_by: session?.user.id }).select("*").single();
    if (error) return setMessage(error.message);
    const created = data as ContentItem;
    setItems((current) => [created, ...current]);
    setSelected(created);
    setActive("Content");
  }

  async function saveSelected() {
    if (!selected) return;
    const cleanSlug = selected.slug || selected.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { data, error } = await supabase.from("content_items").update({
      title: selected.title,
      slug: cleanSlug,
      content_type: selected.content_type,
      role_key: selected.role_key || null,
      summary: selected.summary,
      body: selected.body,
      safety_level: selected.safety_level,
      status: selected.status,
      updated_by: session?.user.id,
    }).eq("id", selected.id).select("*").single();
    if (error) return setMessage(error.message);
    setItems((current) => current.map((item) => item.id === selected.id ? data as ContentItem : item));
    setSelected(null);
    setMessage("Content saved.");
  }

  if (loading) return <main className="wrap section"><p>Checking Hope Tech administrator access…</p></main>;
  if (!session) return <AdminLogin />;

  if (!profile || !["admin", "editor"].includes(profile.role)) {
    return <main className="wrap section">
      <p className="eyebrow">Access restricted</p>
      <h1>This account does not have admin access.</h1>
      <p>Signed in as <strong>{session.user.email}</strong>.</p>
      {accessError && <p>Role lookup error: {accessError}</p>}
      <div className="button-row">
        <button className="button primary" onClick={() => void loadAccess(session)}>Check access again</button>
        <button className="button secondary" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
    </main>;
  }

  return <main className="admin-page">
    <aside className="admin-sidebar">
      <Link href="/" className="admin-brand"><span>HT</span><div><strong>Hope Tech</strong><small>Administration</small></div></Link>
      <nav>{sections.map((section) => <button key={section} className={active === section ? "active" : ""} onClick={() => setActive(section)}>{section}</button>)}</nav>
      <div className="admin-sidebar-note"><strong>Connected as {profile.role}</strong><span className="setup-dot"/> Supabase persistence active</div>
      <button className="return-link" onClick={() => supabase.auth.signOut()}>Sign out</button>
      <Link href="/" className="return-link">Return to volunteer site</Link>
    </aside>

    <section className="admin-main">
      <header className="admin-header"><div><p className="eyebrow">Admin portal · {profile.display_name || profile.email}</p><h1>{active}</h1></div><button className="admin-primary" onClick={createDraft}>+ New content</button></header>
      {message && <div className="admin-notice"><div><strong>{message}</strong></div><button onClick={() => setMessage("")}>×</button></div>}

      {active === "Overview" ? <>
        <div className="admin-notice"><div><strong>Live content management is active.</strong><p>Changes are stored in the dedicated Hope Tech database and protected by administrator access.</p></div><span>LIVE</span></div>
        <div className="metric-grid">
          <article><small>Published</small><strong>{counts.published}</strong><p>Live volunteer resources</p></article>
          <article><small>Drafts</small><strong>{counts.drafts}</strong><p>Waiting for review</p></article>
          <article><small>Volunteer safe</small><strong>{counts.safe}</strong><p>Immediate actions</p></article>
          <article><small>Lead only</small><strong>{counts.lead}</strong><p>Escalated procedures</p></article>
        </div>
        <section className="admin-panel"><div className="panel-title"><div><p className="eyebrow">Recent content</p><h2>Keep guidance current.</h2></div><button onClick={() => setActive("Content")}>View all</button></div><ContentTable items={items.slice(0, 6)} onSelect={setSelected}/></section>
      </> : <section className="admin-panel content-manager">
        <div className="panel-title"><div><p className="eyebrow">Content library</p><h2>{active}</h2></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search content"/></div>
        <ContentTable items={filtered} onSelect={setSelected}/>
      </section>}
    </section>

    {selected && <Editor item={selected} setItem={setSelected} onClose={() => setSelected(null)} onSave={saveSelected}/>} 
  </main>;
}

function AdminLogin() {
  const [email, setEmail] = useState("scott.skweb@gmail.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("Signing in…");
    const result = await supabase.auth.signInWithPassword({ email, password });
    setMessage(result.error ? result.error.message : "Signed in. Checking administrator access…");
  }

  return <main className="wrap section"><div className="admin-login-card"><p className="eyebrow">Hope Tech administration</p><h1>Sign in</h1><p>Use the approved administrator account.</p><form onSubmit={submit}><label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)}/></label><label>Password<input type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)}/></label><button className="admin-primary" type="submit">Sign in</button></form>{message && <p>{message}</p>}</div></main>;
}

function Editor({ item, setItem, onClose, onSave }: { item: ContentItem; setItem: (item: ContentItem) => void; onClose: () => void; onSave: () => void }) {
  return <div className="editor-backdrop" onClick={onClose}><aside className="editor-drawer" onClick={(event) => event.stopPropagation()}><div className="editor-header"><div><p className="eyebrow">Content editor</p><h2>{item.title}</h2></div><button onClick={onClose}>×</button></div>
    <label>Title<input value={item.title} onChange={(event) => setItem({ ...item, title: event.target.value })}/></label>
    <label>URL slug<input value={item.slug} onChange={(event) => setItem({ ...item, slug: event.target.value })}/></label>
    <div className="editor-row"><label>Type<select value={item.content_type} onChange={(event) => setItem({ ...item, content_type: event.target.value as ContentItem["content_type"] })}><option value="role">Role</option><option value="guide">Guide</option><option value="troubleshooting">Troubleshooting</option><option value="assistant">Assistant Answer</option><option value="media">Media</option><option value="setting">Setting</option></select></label><label>Role<select value={item.role_key ?? ""} onChange={(event) => setItem({ ...item, role_key: event.target.value })}><option value="switcher">Switcher</option><option value="camera">Camera</option><option value="propresenter">ProPresenter</option><option value="audio">Audio</option><option value="lighting">Lighting</option><option value="">General</option></select></label></div>
    <div className="editor-row"><label>Status<select value={item.status} onChange={(event) => setItem({ ...item, status: event.target.value as ContentItem["status"] })}><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label><label>Safety level<select value={item.safety_level} onChange={(event) => setItem({ ...item, safety_level: event.target.value as ContentItem["safety_level"] })}><option value="volunteer_safe">Volunteer Safe</option><option value="technical_lead">Technical Lead</option><option value="admin_only">Administrator Only</option></select></label></div>
    <label>Summary<textarea rows={5} value={item.summary ?? ""} onChange={(event) => setItem({ ...item, summary: event.target.value })}/></label>
    <div className="editor-actions"><button className="secondary-admin" onClick={onClose}>Cancel</button><button className="admin-primary" onClick={onSave}>Save</button></div>
  </aside></div>;
}

function ContentTable({ items, onSelect }: { items: ContentItem[]; onSelect: (item: ContentItem) => void }) {
  return <div className="content-table"><div className="content-row content-head"><span>Title</span><span>Type</span><span>Role</span><span>Safety</span><span>Status</span></div>{items.map((item) => <button className="content-row" key={item.id} onClick={() => onSelect(item)}><span><strong>{item.title}</strong><small>Updated {new Date(item.updated_at).toLocaleDateString()}</small></span><span>{label(item.content_type)}</span><span>{label(item.role_key || "general")}</span><span><i className={item.safety_level === "volunteer_safe" ? "safe-indicator" : "lead-indicator"}/>{label(item.safety_level)}</span><span className={item.status === "published" ? "published-pill" : "draft-pill"}>{label(item.status)}</span></button>)}</div>;
}

function label(value: string) {
  return value.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
