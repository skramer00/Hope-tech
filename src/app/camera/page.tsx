import Link from "next/link";
import "./camera.css";

const positions = [
  {n:"1",name:"Primary close",mission:"Follow the speaker or main singer with a steady medium or close shot.",priority:"Speaker · worship leader",avoid:"Empty stage · unnecessary movement"},
  {n:"2",name:"Safe wide / motion",mission:"Provide the dependable wide shot and follow larger movement when staffed.",priority:"Room · stage movement · fallback",avoid:"Over-zooming · constant reframing"},
  {n:"3",name:"Side close-ups",mission:"Support Camera 1 with alternate close-ups from the side angle.",priority:"Alternate speaker angle · worship detail",avoid:"Matching Camera 1 exactly · competing movement"}
];

const cues = [
  ["Ready 1", "Prepare a usable shot. Finish movement and focus, then hold."],
  ["Take 1", "You are being switched live. Watch for red tally and stay steady."],
  ["Hold", "Keep the current composition. Do not move or zoom."],
  ["Stand by", "Listen closely. The director expects to use you soon."],
  ["Clear / Reset", "You are off-air and may calmly prepare a new shot."],
  ["Wider / Tighter", "Adjust slowly while off-air unless the director says otherwise."]
];

export default function CameraPage(){
 return <div className="wrap section camera-page">
  <div className="page-heading"><div><p className="eyebrow">Camera Operator</p><h1>Give the director a steady, ready shot.</h1><p className="lead">All three staffed positions use the same camera system. What changes is the purpose of the shot.</p></div><Link className="button primary" href="/camera/live">Enter Camera Live Mode</Link></div>

  <section className="camera-golden-rule"><strong>Red tally means you are live.</strong><span>Hold steady. Do not reframe unless directed.</span></section>

  <section className="subsection"><p className="eyebrow">Choose your position</p><h2>What camera are you running?</h2><div className="position-grid">{positions.map(p=><article key={p.n} className={`position-card camera-${p.n}`}><div className="position-number">{p.n}</div><div><h3>{p.name}</h3><p>{p.mission}</p><dl><div><dt>Prioritize</dt><dd>{p.priority}</dd></div><div><dt>Avoid</dt><dd>{p.avoid}</dd></div></dl></div></article>)}</div></section>

  <section className="subsection framing-section"><p className="eyebrow">Framing basics</p><h2>Build a calm, intentional picture.</h2><div className="framing-grid">
    <article className="frame-example good"><div className="viewfinder"><span className="head good-head"/><i className="eye-line"/></div><h3>Good medium shot</h3><p>Eyes near the upper third, comfortable headroom, and room in the direction the person faces.</p></article>
    <article className="frame-example bad"><div className="viewfinder"><span className="head too-low"/></div><h3>Too much headroom</h3><p>The subject feels small and the frame looks accidental.</p></article>
    <article className="frame-example bad"><div className="viewfinder"><span className="head too-tight"/></div><h3>Too tight</h3><p>Avoid cutting through the chin or crowding the top of the head.</p></article>
    <article className="frame-example bad"><div className="viewfinder"><span className="head edge-head"/></div><h3>No looking room</h3><p>Leave space in front of the subject, not behind them.</p></article>
  </div></section>

  <section className="subsection"><p className="eyebrow">Director language</p><h2>Know what each cue means.</h2><div className="cue-grid">{cues.map(([cue,meaning])=><article key={cue}><strong>{cue}</strong><p>{meaning}</p></article>)}</div></section>

  <section className="camera-workflow"><div><span>1</span><h3>Listen</h3><p>Keep the intercom on and acknowledge only when needed.</p></div><div><span>2</span><h3>Move off-air</h3><p>Reframe while tally is off. Make movements smooth and purposeful.</p></div><div><span>3</span><h3>Settle</h3><p>Finish focus and composition before the director takes you.</p></div><div><span>4</span><h3>Hold live</h3><p>When tally turns red, protect the shot and stay steady.</p></div></section>

  <section className="subsection"><p className="eyebrow">Quick recovery</p><h2>When something goes wrong</h2><div className="camera-issue-grid">
    <article><h3>Lost focus</h3><p>Tell the director immediately. Do not hide it. Refocus while off-air and confirm when ready.</p></article>
    <article><h3>Subject walks away</h3><p>Follow only if that is your role and the move is smooth. Otherwise tell the director you lost the shot.</p></article>
    <article><h3>Tally is unclear</h3><p>Assume you may be live. Hold steady and ask the director for confirmation.</p></article>
    <article><h3>Tripod or controls resist</h3><p>Do not force them. Stay safe, notify the director, and use the best stable shot available.</p></article>
    <article><h3>Intercom stops working</h3><p>Hold a safe usable shot, use visual tally, and alert the nearest team member when possible.</p></article>
    <article><h3>You are not ready</h3><p>Say “not ready” clearly. A truthful warning is better than sending a bad shot live.</p></article>
  </div></section>

  <section className="practice-card"><div><p className="eyebrow">Practice scenario</p><h2>The director says “Ready 3.” What do you do?</h2><p>Finish your move, confirm focus and framing, then hold the shot. Do not wait until “Take 3” to begin getting ready.</p></div><Link className="button secondary" href="/camera/live">Practice in Live Mode</Link></section>
 </div>
}
