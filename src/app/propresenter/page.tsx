import Link from "next/link";
import "./propresenter.css";

const workflow = [
  ["Preservice loop", "Run the approved loop and confirm the output is visible on the switcher."],
  ["Welcome", "Stay on the loop until cued, then clear or advance to the requested content."],
  ["Opening worship", "Follow the worship leader, not just the planned order. Hold the current lyric until the next phrase begins."],
  ["Meet & greet", "Clear lyrics unless directed otherwise. Prepare announcements or the next service item."],
  ["Announcements", "Select each announcement slide when cued. Do not rush ahead."],
  ["Sermon", "Follow scripture, quotes, and sermon slides. If the speaker skips ahead, jump directly to the correct slide."],
  ["Communion", "Use only the approved lyrics, scripture, or holding background for this segment."],
  ["Closing worship", "Return to lyric-following mode and stay with the worship leader."],
  ["Ending loop", "Start the ending loop, confirm it is visible, and leave the presentation ready for the next service."]
];

const actions = [
  ["Advance", "Use the next-slide control once when the next lyric or slide is needed."],
  ["Go back", "Use the previous-slide control once. Avoid repeated rapid clicks."],
  ["Jump to a slide", "Click the exact slide needed instead of clicking through many slides."],
  ["Clear the screen", "Use the approved Clear action when content should disappear while keeping ProPresenter ready."],
  ["Resume content", "Select the correct slide again after clearing."],
  ["Start a video", "Select the video cue once and verify playback begins."],
  ["Stop a video", "Use the approved stop or clear control, then prepare the next slide or loop."]
];

const issues = [
  ["Wrong slide is showing", "Click the correct slide directly. Do not rapidly click Next trying to catch up."],
  ["Lyrics are behind", "Stay calm and jump to the current lyric. Then resume normal pacing."],
  ["The pastor skipped slides", "Select the slide matching what is being discussed now. Ignore skipped slides."],
  ["Output is black", "Keep working on the operator screen, confirm the correct presentation is open, and alert the director or technical lead."],
  ["Video will not play", "Do not repeatedly click it. Return to a safe slide or clear screen and alert the technical lead."],
  ["ProPresenter freezes", "Do not force-quit during a live moment unless directed. Tell the director and technical lead immediately."]
];

export default function ProPresenterPage(){return <div className="wrap section pp-page">
  <div className="page-heading"><div><p className="eyebrow">ProPresenter 7</p><h1>Keep the congregation with the service.</h1><p className="lead">Run the already-configured presentation, follow the live moment, and recover without panic-clicking.</p></div><Link className="button primary" href="/propresenter/live">Enter Live Mode</Link></div>

  <section className="pp-quick"><div><p className="eyebrow">Before service</p><h2>Five checks</h2></div><ol><li>Open ProPresenter 7.</li><li>Open today’s approved presentation or playlist.</li><li>Confirm the output is active.</li><li>Confirm the stage or confidence display is correct.</li><li>Start the preservice loop and verify the switcher can see it.</li></ol></section>

  <section className="subsection"><p className="eyebrow">Sunday workflow</p><h2>Follow the order, but respond to the room.</h2><div className="pp-timeline">{workflow.map(([name,body],i)=><details key={name} open={i===0}><summary><span>{i+1}</span><strong>{name}</strong></summary><p>{body}</p></details>)}</div></section>

  <section className="subsection"><p className="eyebrow">Common actions</p><h2>Use one intentional action at a time.</h2><div className="pp-card-grid">{actions.map(([title,body])=><article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></section>

  <section className="subsection"><p className="eyebrow">Fast recovery</p><h2>When something goes wrong</h2><div className="pp-issue-grid">{issues.map(([title,body],i)=><article key={title}><span>{i<3?"Volunteer safe":"Escalate"}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>

  <div className="danger"><strong>Do not change:</strong> screen configuration, output routing, audience/stage display setup, resolutions, themes, or system preferences during a service unless authorized.</div>
</div>}
