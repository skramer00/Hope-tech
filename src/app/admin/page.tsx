"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import "./admin.css";

type ContentType = "Role" | "Guide" | "Troubleshooting" | "Assistant Answer";
type Status = "Published" | "Draft";

type ContentItem = {
  id: string;
  title: string;
  type: ContentType;
  role: string;
  status: Status;
  safety: "Volunteer Safe" | "Technical Lead";
  updated: string;
};

const seedItems: ContentItem[] = [
  { id: "switcher-role", title: "Switcher Director", type: "Role", role: "Switcher", status: "Published", safety: "Volunteer Safe", updated: "Today" },
  { id: "camera-role", title: "Camera Operator", type: "Role", role: "Camera", status: "Published", safety: "Volunteer Safe", updated: "Today" },
  { id: "propresenter-role", title: "ProPresenter 7", type: "Role", role: "ProPresenter", status: "Published", safety: "Volunteer Safe", updated: "Today" },
  { id: "safe-shot", title: "Camera 2 Safe Shot", type: "Guide", role: "Switcher", status: "Published", safety: "Volunteer Safe", updated: "Today" },
  { id: "camera-black", title: "Camera Is Black", type: "Troubleshooting", role: "Switcher", status: "Published", safety: "Volunteer Safe", updated: "Today" },
  { id: "pp-frozen", title: "ProPresenter Is Frozen", type: "Assistant Answer", role: "ProPresenter", status: "Published", safety: "Technical Lead", updated: "Today" },
];

const sections = ["Overview", "Content", "Roles & Devices", "Assistant Knowledge", "Media", "Settings"];

export default function AdminPage() {
  const [active, setActive] = useState("Overview");
  const [items, setItems] = useState(seedItems);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ContentItem | null>(null);

  const filtered = useMemo(() => items.filter((item) => `${item.title} ${item.type} ${item.role}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  const counts = {
    published: items.filter((item) => item.status === "Published").length,
    drafts: items.filter((item) => item.status === "Draft").length,
    safe: items.filter((item) => item.safety === "Volunteer Safe").length,
    lead: items.filter((item) => item.safety === "Technical Lead").length,
  };

  function createDraft() {
    const draft: ContentItem = {
      id: `draft-${Date.now()}`,
      title: "Untitled guide",
      type: "Guide",
      role: "Switcher",
      status: "Draft",
      safety: "Volunteer Safe",
      updated: "Just now",
    };
    setItems((current) => [draft, ...current]);
    setSelected(draft);
    setActive("Content");
  }

  function saveSelected() {
    if (!selected) return;
    setItems((current) => current.map((item) => item.id === selected.id ? { ...selected, updated: "Just now" } : item));
  }

  return <main className="admin-page">
    <aside className="admin-sidebar">
      <Link href="/" className="admin-brand"><span>HT</span><div><strong>Hope Tech</strong><small>Administration</small></div></Link>
      <nav>{sections.map((section) => <button key={section} className={active === section ? "active" : ""} onClick={() => setActive(section)}>{section}</button>)}</nav>
      <div className="admin-sidebar-note"><strong>Setup status</strong><span className="setup-dot"/> Supabase connection pending</div>
      <Link href="/" className="return-link">Return to volunteer site</Link>
    </aside>

    <section className="admin-main">
      <header className="admin-header"><div><p className="eyebrow">Admin portal</p><h1>{active}</h1></div><button className="admin-primary" onClick={createDraft}>+ New content</button></header>

      {active === "Overview" && <>
        <div className="admin-notice"><div><strong>Admin interface preview is active.</strong><p>The editor structure is ready. Database persistence and secure sign-in will turn on after a dedicated Hope Tech Supabase project is connected.</p></div><span>PREVIEW</span></div>
        <div className="metric-grid">
          <article><small>Published</small><strong>{counts.published}</strong><p>Live volunteer resources</p></article>
          <article><small>Drafts</small><strong>{counts.drafts}</strong><p>Waiting for review</p></article>
          <article><small>Volunteer safe</small><strong>{counts.safe}</strong><p>Immediate actions</p></article>
          <article><small>Lead only</small><strong>{counts.lead}</strong><p>Escalated procedures</p></article>
        </div>
        <section className="admin-panel"><div className="panel-title"><div><p className="eyebrow">Recent content</p><h2>Keep guidance current.</h2></div><button onClick={() => setActive("Content")}>View all</button></div><ContentTable items={items.slice(0, 5)} onSelect={setSelected}/></section>
        <div className="admin-two-column"><section className="admin-panel"><p className="eyebrow">Quick actions</p><div className="quick-admin-actions"><button onClick={createDraft}>Create a guide</button><button onClick={() => setActive("Assistant Knowledge")}>Add assistant answer</button><button onClick={() => setActive("Roles & Devices")}>Manage a role</button><button onClick={() => setActive("Media")}>Upload a visual</button></div></section><section className="admin-panel"><p className="eyebrow">Content health</p><h2>Next review priorities</h2><ul className="review-list"><li><span>Switcher startup checklist</span><strong>Review soon</strong></li><li><span>Camera framing examples</span><strong>Needs photos</strong></li><li><span>ProPresenter video procedure</span><strong>Confirm audio</strong></li></ul></section></div>
      </>}

      {active !== "Overview" && <section className="admin-panel content-manager">
        <div className="panel-title"><div><p className="eyebrow">Content library</p><h2>{active}</h2></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search content"/></div>
        <ContentTable items={filtered} onSelect={setSelected}/>
      </section>}
    </section>

    {selected && <div className="editor-backdrop" onClick={() => setSelected(null)}><aside className="editor-drawer" onClick={(event) => event.stopPropagation()}><div className="editor-header"><div><p className="eyebrow">Content editor</p><h2>{selected.title}</h2></div><button onClick={() => setSelected(null)}>×</button></div><label>Title<input value={selected.title} onChange={(event) => setSelected({ ...selected, title: event.target.value })}/></label><div className="editor-row"><label>Type<select value={selected.type} onChange={(event) => setSelected({ ...selected, type: event.target.value as ContentType })}><option>Role</option><option>Guide</option><option>Troubleshooting</option><option>Assistant Answer</option></select></label><label>Role<select value={selected.role} onChange={(event) => setSelected({ ...selected, role: event.target.value })}><option>Switcher</option><option>Camera</option><option>ProPresenter</option><option>Audio</option><option>Lighting</option></select></label></div><div className="editor-row"><label>Status<select value={selected.status} onChange={(event) => setSelected({ ...selected, status: event.target.value as Status })}><option>Published</option><option>Draft</option></select></label><label>Safety level<select value={selected.safety} onChange={(event) => setSelected({ ...selected, safety: event.target.value as ContentItem["safety"] })}><option>Volunteer Safe</option><option>Technical Lead</option></select></label></div><label>Summary<textarea rows={4} placeholder="What should the volunteer know or do?"/></label><div className="block-builder"><div><strong>Guide blocks</strong><small>Add structured content</small></div><div className="block-buttons"><button>+ Step</button><button>+ Warning</button><button>+ Tip</button><button>+ Image</button><button>+ Checklist</button><button>+ Decision</button></div></div><div className="editor-actions"><button className="secondary-admin" onClick={() => setSelected(null)}>Cancel</button><button className="admin-primary" onClick={() => { saveSelected(); setSelected(null); }}>Save draft</button></div></aside></div>}
  </main>;
}

function ContentTable({ items, onSelect }: { items: ContentItem[]; onSelect: (item: ContentItem) => void }) {
  return <div className="content-table"><div className="content-row content-head"><span>Title</span><span>Type</span><span>Role</span><span>Safety</span><span>Status</span></div>{items.map((item) => <button className="content-row" key={item.id} onClick={() => onSelect(item)}><span><strong>{item.title}</strong><small>Updated {item.updated}</small></span><span>{item.type}</span><span>{item.role}</span><span><i className={item.safety === "Volunteer Safe" ? "safe-indicator" : "lead-indicator"}/>{item.safety}</span><span className={item.status === "Published" ? "published-pill" : "draft-pill"}>{item.status}</span></button>)}</div>;
}
