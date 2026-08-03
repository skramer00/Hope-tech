import Link from "next/link";
import "./propresenter.css";

const workflow = [
  ["Preservice", "Run the approved loop and confirm the switcher can see it."],
  ["Welcome", "Stay on the loop until cued, then clear or select the requested content."],
  ["Worship", "Follow the worship leader. Hold each lyric until the next phrase begins."],
  ["Meet & greet", "Clear lyrics and prepare announcements or the next service item."],
  ["Announcements", "Select each slide when cued. Do not rush ahead."],
  ["Sermon", "Follow the speaker. Jump directly to the current scripture, quote, or slide when the order changes."],
  ["Communion", "Use only the approved scripture, lyrics, or holding background."],
  ["Closing", "Return to lyric-following mode, then start the ending loop when cued."]
];

const recovery = [
  ["Wrong slide", "Click the correct slide directly."],
  ["Lyrics are behind", "Jump to the current lyric, then resume normal pacing."],
  ["Speaker skips ahead", "Select what matches the live moment and ignore skipped slides."],
  ["Output is black", "Keep the presentation ready and alert the director or technical lead."],
  ["Video will not play", "Return to a safe slide or clear the screen. Do not repeatedly click the cue."],
  ["ProPresenter freezes", "Tell the director immediately. Do not force-quit unless directed."]
];

export default function ProPresenterPage(){return <div className="wrap section pp-page">
  <header className="pp-hero">
    <div><p className="eyebrow">ProPresenter</p><h1>Follow the live moment.</h1><p className="lead">Run the prepared service, stay with the speaker or worship leader, and recover with one intentional action.</p></div>
    <div className="pp-actions"><Link className="button primary" href="/propresenter/live">Live Service Mode</Link><a className="button secondary" href="#workflow">Service Workflow</a></div>
  </header>

  <section className="pp-summary" aria-label="ProPresenter quick reference">
    <article><span>Before service</span><strong>Open today’s presentation</strong><p>Confirm output, stage display, and the preservice loop.</p></article>
    <article><span>During service</span><strong>Click once, then verify</strong><p>Use the exact slide needed instead of panic-clicking Next.</p></article>
    <article><span>When unsure</span><strong>Clear to a safe screen</strong><p>Keep ProPresenter ready and tell the director what happened.</p></article>
  </section>

  <section className="subsection pp-workflow-section" id="workflow"><p className="eyebrow">Service workflow</p><h2>Choose the current phase.</h2><div className="pp-timeline">{workflow.map(([name,body],i)=><details key={name} open={i===0}><summary><span>{i+1}</span><strong>{name}</strong></summary><p>{body}</p></details>)}</div></section>

  <section className="subsection"><p className="eyebrow">Fast recovery</p><h2>Fix the moment without making it worse.</h2><div className="pp-issue-grid">{recovery.map(([title,body],i)=><article key={title}><span>{i<3?"Do now":"Escalate"}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>

  <section className="pp-boundary"><strong>Do not change during a service:</strong><span>output routing, screen configuration, audience or stage-display setup, resolutions, themes, or system preferences.</span></section>
</div>}
