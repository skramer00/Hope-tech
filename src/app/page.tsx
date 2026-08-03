import Link from "next/link";

const roles = [
  ["Switcher Director", "Live", "/switcher", "Direct cameras, switch sources, and keep the service moving."],
  ["Camera Operator", "Live", "/camera", "Framing, movement, tally, and communication with the director."],
  ["ProPresenter", "Live", "/propresenter", "Lyrics, sermon slides, videos, and presentation troubleshooting."],
  ["Audio", "Planned", "#", "Fast guidance for the Yamaha QL5 and common audio issues."],
  ["Lighting", "Planned", "#", "Approved looks, service cues, and safe recovery steps."],
  ["Intercom", "Planned", "#", "Clear-Com basics and communication etiquette."]
];

export default function Home() {
  return <>
    <section className="hero wrap">
      <div>
        <p className="eyebrow">Learn · Serve · Troubleshoot</p>
        <h1>Clear technical help, right when volunteers need it.</h1>
        <p className="lead">Quick-start training and first-line support built around Hope’s actual equipment, roles, and Sunday workflow.</p>
        <div className="button-row"><Link className="button primary" href="/switcher">Open Switcher Guide</Link><Link className="button secondary" href="/camera">Open Camera Guide</Link><Link className="button secondary" href="/propresenter">Open ProPresenter Guide</Link><Link className="button secondary" href="/troubleshooting">Something went wrong</Link></div>
      </div>
      <div className="hero-visual"><div className="screen"><span className="preview">PREVIEW</span><span className="program">PROGRAM</span><div className="camera-box">CAM 1</div><div className="camera-box safe-box">CAM 2 · SAFE</div><div className="camera-box">CAM 3</div><div className="camera-box">PROPRESENTER</div></div></div>
    </section>
    <section className="wrap section">
      <p className="eyebrow">Choose your role</p><h2>What are you running today?</h2>
      <div className="card-grid">{roles.map(([name,status,href,desc]) => <Link className={`role-card ${href==="#" ? "disabled" : ""}`} href={href} key={name}><span className="status">{status}</span><h3>{name}</h3><p>{desc}</p></Link>)}</div>
    </section>
  </>;
}
