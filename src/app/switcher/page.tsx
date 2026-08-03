import Link from "next/link";
import PreServiceChecklist from "@/components/PreServiceChecklist";

const cameras = [
  ["1", "Primary close", "Medium or close shot of the speaker or main singer. Always staffed.", "Speaker · lead singer"],
  ["2", "Wide / motion", "Default safe shot. Staffed when available; may remain static without an operator.", "Fallback · movement · room"],
  ["3", "Side close-ups", "Supplemental close angles from the side. Always staffed.", "Alternate close-up"],
  ["4", "Special stage", "Used for baptisms or the ASL interpreter.", "Special services"],
  ["5", "Keyboard", "Static mounted musician shot.", "Instrumental moments"],
  ["6", "Drums", "Static mounted musician shot.", "Energetic worship"],
  ["PP", "ProPresenter", "Presentation feed for loops, lyrics, slides, and cued content.", "Loops · slides · lyrics"]
];

const flow = [
  ["Preservice loop", "ProPresenter", "Keep the preservice loop on Program. Put Camera 2 in Preview so the welcome is ready."],
  ["Welcome", "Cut", "Favor Camera 1 for the host. Use Camera 3 only after it is settled. Camera 2 is the fallback."],
  ["Opening worship", "Fade", "Use Cameras 1, 2, and 3 for people; add Cameras 5 and 6 for intentional musician shots."],
  ["Meet & greet", "Cut to Camera 2", "Use the wide shot. Do not chase individuals around the room."],
  ["Announcements", "Cut", "Use Camera 1 for the presenter and take ProPresenter only when the content is cued."],
  ["Sermon", "Cut", "Stay primarily on Camera 1. Use Camera 3 sparingly for variety and Camera 2 when movement demands it."],
  ["Communion", "Calm fades", "Use deliberate wide, pastor, and musician shots. Hold shots longer and avoid distracting movement."],
  ["Closing worship", "Fade", "Return to worship coverage with settled camera and musician shots."],
  ["Ending loop", "ProPresenter", "Take the ending loop, place Camera 2 in Preview, and leave the system in its standard state."]
];

export default function SwitcherPage() {
 return <div className="wrap section">
  <div className="page-heading"><div><p className="eyebrow">Switcher Director</p><h1>Run the service with confidence.</h1><p className="lead">Cue the camera, wait for a settled shot, verify it in Preview, then transition.</p></div><div className="safe-shot"><small>When unsure, use</small><strong>Camera 2</strong><span>Safe wide shot</span></div></div>
  <div className="rule-banner"><strong>Music fades.</strong><span>Speaking and everything else cuts.</span></div>

  <PreServiceChecklist />

  <section className="subsection live-reference">
    <div className="section-heading"><div><p className="eyebrow">Live reference</p><h2>Preview first. Then switch.</h2></div><Link className="button emergency-button" href="/troubleshooting">Something went wrong</Link></div>
    <div className="two-column">
      <div className="multiview"><div className="mv-top"><div className="preview-pane"><small>GREEN · NEXT</small>M/E 2 PREVIEW<br/><strong>CAMERA 3</strong></div><div className="program-pane"><small>RED · LIVE</small>M/E 2 PROGRAM<br/><strong>CAMERA 1</strong></div></div><div className="mv-grid">{["CAM 1","CAM 2 · SAFE","CAM 3","CAM 4","CAM 5 · KEYS","CAM 6 · DRUMS","PROPRESENTER","STAGE"].map(x=><div key={x}>{x}</div>)}</div></div>
      <div className="panel"><p className="eyebrow">Core workflow</p><ol className="steps"><li><strong>Watch Program.</strong> Know what viewers see now.</li><li><strong>Cue the next shot.</strong> Give the camera operator time to move.</li><li><strong>Check Preview.</strong> Confirm framing, focus, and subject.</li><li><strong>Transition.</strong> Fade for music; cut for speaking.</li><li><strong>Prepare again.</strong> Keep Camera 2 available when uncertain.</li></ol><div className="quick-warning"><strong>Never take a moving, black, or unconfirmed camera.</strong></div></div>
    </div>
  </section>

  <section className="subsection"><p className="eyebrow">Camera cheat sheet</p><h2>Choose each source by purpose.</h2><div className="camera-grid">{cameras.map(([num,name,desc,use]) => <article className={`camera-card ${num==="2" ? "safe" : ""}`} key={num}><div className="camera-card-top"><small>{num==="PP" ? "INPUT" : `CAMERA ${num}`}</small>{num==="2" && <span>SAFE</span>}</div><h3>{name}</h3><p>{desc}</p><strong className="best-for">Best for: {use}</strong></article>)}</div></section>

  <section className="subsection"><p className="eyebrow">Sunday playbook</p><h2>Follow the order of service.</h2><div className="timeline">{flow.map(([name,transition,guide],i)=><details key={name} open={i===0}><summary><span>{i+1}</span><div><strong>{name}</strong><small>{transition}</small></div></summary><p>{guide}</p></details>)}</div></section>

  <section className="fallback-card"><div><p className="eyebrow">Fast recovery</p><h2>When you lose the next shot</h2><p>Stay on the current usable source, or take Camera 2. Regroup, cue the next operator, and continue. Do not panic-switch.</p></div><Link className="button primary" href="/troubleshooting">Open troubleshooting</Link></section>
 </div>;
}
