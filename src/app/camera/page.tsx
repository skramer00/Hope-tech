import Link from "next/link";
import "./camera.css";

const positions = [
  {n:"1",name:"Primary close",mission:"Speaker or main singer. Hold a steady medium or close shot.",priority:"Speaker · worship leader"},
  {n:"2",name:"Safe wide",mission:"Dependable room or stage-wide shot and the default fallback.",priority:"Room · movement · recovery"},
  {n:"3",name:"Side close-ups",mission:"Alternate close-ups that complement Camera 1.",priority:"Side angle · worship detail"}
];

const phases = [
  ["Before service", "Put on the headset, verify intercom and tally, unlock movement, and build a safe starting shot."],
  ["Worship", "Follow your assigned subject, anticipate movement, and settle before the director takes you."],
  ["Speaking", "Favor stable medium or close shots. Avoid unnecessary zooms while the speaker is talking."],
  ["Sermon", "Stay with the speaker and protect focus. Camera 2 remains the dependable wide option."],
  ["Communion", "Use calm, respectful compositions and follow the director’s specific assignments."],
  ["Closing", "Return to worship coverage, then hold the final shot until the director releases you."]
];

const cues = [
  ["Ready", "Finish movement and focus, then hold."],
  ["Take", "You are live. Watch red tally and stay steady."],
  ["Hold", "Keep the current composition."],
  ["Reset", "You are off-air and may prepare a new shot."],
  ["Wider / tighter", "Adjust smoothly while off-air unless told otherwise."],
  ["Not ready", "Say it clearly before a bad shot is taken live."]
];

export default function CameraPage(){return <div className="wrap section camera-page">
  <header className="camera-hero"><div><p className="eyebrow">Studio Cameras</p><h1>Build a steady, ready shot.</h1><p className="lead">Listen to the director, make moves while off-air, settle the frame, and protect it when tally turns red.</p></div><div className="camera-actions"><Link className="button primary" href="/camera/live">Camera Live Mode</Link><a className="button secondary" href="#positions">Camera Assignments</a></div></header>

  <section className="camera-summary" aria-label="Camera quick reference">
    <article className="tally-rule"><span>Red tally</span><strong>You are live</strong><p>Hold steady. Do not reframe unless directed.</p></article>
    <article><span>Before a take</span><strong>Move, focus, settle</strong><p>Give the director a finished shot, not a shot still being built.</p></article>
    <article><span>When unsure</span><strong>Hold a usable shot</strong><p>Say “not ready” rather than sending a bad shot live.</p></article>
  </section>

  <section className="subsection" id="positions"><p className="eyebrow">Camera assignments</p><h2>Know the purpose of your position.</h2><div className="position-grid">{positions.map(p=><article key={p.n} className="position-card"><div className="position-number">{p.n}</div><div><h3>{p.name}</h3><p>{p.mission}</p><small>{p.priority}</small></div></article>)}</div></section>

  <section className="subsection"><p className="eyebrow">Service workflow</p><h2>Choose the current phase.</h2><div className="camera-timeline">{phases.map(([name,body],i)=><details key={name} open={i===0}><summary><span>{i+1}</span><strong>{name}</strong></summary><p>{body}</p></details>)}</div></section>

  <section className="subsection"><p className="eyebrow">Director cues</p><h2>Respond simply and clearly.</h2><div className="cue-grid">{cues.map(([cue,meaning])=><article key={cue}><strong>{cue}</strong><p>{meaning}</p></article>)}</div></section>

  <section className="camera-recovery"><div><p className="eyebrow">Something went wrong?</p><h2>Protect the live shot first.</h2><p>Lost focus, unclear tally, failed intercom, or resistant controls: hold the safest stable picture available and tell the director immediately. Never force the tripod or controls.</p></div><Link className="button secondary" href="/troubleshooting">Open Troubleshooting</Link></section>
</div>}
