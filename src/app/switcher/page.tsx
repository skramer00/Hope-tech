import Link from "next/link";

const cameras = [
  ["1", "Primary close", "Medium or close shot of the speaker or main singer. Always staffed."],
  ["2", "Wide / motion", "Default safe shot. Staffed when available; may remain static without an operator."],
  ["3", "Side close-ups", "Supplemental close angles from the side. Always staffed."],
  ["4", "Special stage", "Used for baptisms or the ASL interpreter."],
  ["5", "Keyboard", "Static mounted musician shot."],
  ["6", "Drums", "Static mounted musician shot."],
  ["PP", "ProPresenter", "Presentation feed for loops, lyrics, slides, and other cued content."]
];
const flow = [
  ["Preservice loop", "Keep ProPresenter on Program. Prepare Camera 2 for the welcome."],
  ["Welcome", "Use Camera 1 as primary; Camera 3 for an alternate. Cut between shots."],
  ["Opening worship", "Use Cameras 1, 2, 3, 5, and 6 as appropriate. Fade between shots."],
  ["Meet & greet", "Use Camera 2 wide. Avoid chasing individuals."],
  ["Announcements", "Use Camera 1 and cued ProPresenter content. Cut."],
  ["Sermon", "Favor Camera 1; use Camera 3 sparingly. Camera 2 is the fallback. Cut."],
  ["Communion", "Use calm, intentional coverage and slower fades when music is playing."],
  ["Closing worship", "Return to worship coverage. Fade between settled shots."],
  ["Ending loop", "Take ProPresenter, then return Preview to Camera 2."]
];

export default function SwitcherPage() {
 return <div className="wrap section">
  <div className="page-heading"><div><p className="eyebrow">Switcher Director</p><h1>Run the service with confidence.</h1><p className="lead">Cue the camera, wait for a settled shot, verify it in Preview, then transition.</p></div><div className="safe-shot"><small>Default safe shot</small><strong>Camera 2</strong></div></div>
  <div className="rule-banner"><strong>Music fades.</strong><span>Everything else cuts.</span></div>
  <div className="two-column">
    <div className="multiview"><div className="mv-top"><div className="preview-pane">M/E 2 PREVIEW<br/><strong>CAMERA 3</strong></div><div className="program-pane">M/E 2 PROGRAM<br/><strong>CAMERA 1</strong></div></div><div className="mv-grid">{["CAM 1","CAM 2 · SAFE","CAM 3","CAM 4","CAM 5 · KEYS","CAM 6 · DRUMS","PROPRESENTER","STAGE"].map(x=><div key={x}>{x}</div>)}</div></div>
    <div className="panel"><p className="eyebrow">Core workflow</p><ol className="steps"><li>Watch Program.</li><li>Choose and cue the next camera over intercom.</li><li>Wait for movement and focus to settle.</li><li>Verify the source in Preview.</li><li>Fade for music or cut for speaking.</li></ol><div className="legend"><span><i className="red-dot"/>Red = live</span><span><i className="green-dot"/>Green = next</span></div></div>
  </div>
  <section className="subsection"><p className="eyebrow">Camera map</p><h2>Choose shots by purpose.</h2><div className="camera-grid">{cameras.map(([num,name,desc]) => <article className={`camera-card ${num==="2" ? "safe" : ""}`} key={num}><small>{num==="PP" ? "INPUT" : `CAMERA ${num}`}</small><h3>{name}</h3><p>{desc}</p></article>)}</div></section>
  <section className="subsection"><p className="eyebrow">Sunday playbook</p><h2>Follow the order of service.</h2><div className="timeline">{flow.map(([name,guide],i)=><details key={name} open={i===0}><summary><span>{i+1}</span><strong>{name}</strong></summary><p>{guide}</p></details>)}</div></section>
  <div className="button-row"><Link className="button primary" href="/troubleshooting">Open Troubleshooting</Link></div>
 </div>;
}
