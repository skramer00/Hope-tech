import Link from "next/link";

const sources = ["CAM 1","CAM 2","CAM 3","CAM 4","CAM 5","CAM 6","PP","BLACK"];

export default function PanelGuidePage(){
  return <div className="wrap section panel-guide-page">
    <p className="eyebrow">Physical controller</p>
    <div className="page-heading panel-heading">
      <div><h1>Switch a shot in three moves.</h1><p className="lead">This guide follows the original ATEM 2 M/E Broadcast Panel layout used with this generation of switcher. The exact labels at Hope may differ, but the operating pattern is the same.</p></div>
      <Link className="button secondary" href="/switcher">Back to Switcher</Link>
    </div>

    <div className="panel-model-note"><strong>Confirm before training:</strong> Compare this diagram with the physical panel in the booth. We will revise any button placement that differs.</div>

    <section className="subsection">
      <div className="atem-panel-diagram" aria-label="Simplified ATEM 2 M/E control panel diagram">
        <div className="panel-strip"><span>M/E 2</span><span>HOPE SWITCHER</span><span>TRANSITION</span></div>
        <div className="bus-label">PROGRAM · LIVE</div>
        <div className="source-row program-row">{sources.map(x=><div className={x==="CAM 1"?"panel-key live-key":"panel-key"} key={`pgm-${x}`}>{x}</div>)}</div>
        <div className="bus-label preview-label">PREVIEW · NEXT</div>
        <div className="source-row preview-row">{sources.map(x=><div className={x==="CAM 2"?"panel-key next-key safe-key":"panel-key"} key={`pvw-${x}`}>{x}</div>)}</div>
        <div className="transition-bank"><div className="unused-bank"><span>KEYS / EFFECTS</span><small>Leave these alone unless trained.</small></div><div className="transition-controls"><button className="auto-control">AUTO<br/><small>FADE</small></button><button className="cut-control">CUT</button><div className="tbar"><i/></div></div></div>
      </div>
    </section>

    <section className="three-move-grid">
      <article><span>1</span><h2>Choose Preview</h2><p>Press the next camera on the <strong>Preview row</strong>. At Hope, Camera 2 is the safe choice when you are unsure.</p></article>
      <article><span>2</span><h2>Check the monitor</h2><p>Confirm the green-bordered Preview image is focused, framed, and no longer moving.</p></article>
      <article><span>3</span><h2>Transition</h2><p>Press <strong>AUTO</strong> for music. Press <strong>CUT</strong> for welcome, announcements, sermon, and other speaking.</p></article>
    </section>

    <section className="control-explainer-grid">
      <article className="control-explainer green-control"><small>USE THIS ROW</small><h2>Preview</h2><p>Selects what will appear next. Pressing a Preview source does not put it live.</p></article>
      <article className="control-explainer red-control"><small>USE WITH CAUTION</small><h2>Program</h2><p>Program is already live. Avoid pressing source buttons here during normal operation; prepare shots in Preview instead.</p></article>
      <article className="control-explainer gold-control"><small>MUSIC</small><h2>AUTO / Fade</h2><p>Runs the configured smooth transition from Preview to Program.</p></article>
      <article className="control-explainer"><small>SPEAKING</small><h2>CUT</h2><p>Immediately exchanges Preview and Program without a visible fade.</p></article>
    </section>

    <div className="danger controls-danger"><strong>Do not adjust:</strong> transition settings, keyers, macros, M/E assignment, video standard, or system configuration unless you are specifically trained and authorized.</div>

    <section className="fallback-card"><div><p className="eyebrow">Practice prompt</p><h2>Camera 1 is live. Put Camera 3 on next.</h2><p>Press Camera 3 on Preview, verify the green Preview box, then choose AUTO during music or CUT during speaking.</p></div><Link className="button primary" href="/troubleshooting">Open troubleshooting</Link></section>
  </div>
}
