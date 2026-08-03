import Image from "next/image";
import Link from "next/link";

const roles = [
  ["Switcher Director", "Live", "/switcher", "Direct cameras, switch sources, and keep the service moving."],
  ["Camera Operator", "Live", "/camera", "Framing, movement, tally, and communication with the director."],
  ["ProPresenter", "Live", "/propresenter", "Lyrics, sermon slides, videos, and presentation troubleshooting."],
  ["Ask Hope Tech", "New", "/ask", "Search approved Hope procedures for fast, volunteer-safe help."],
  ["Audio", "Planned", "#", "Fast guidance for the Yamaha QL5 and common audio issues."],
  ["Lighting", "Planned", "#", "Approved looks, service cues, and safe recovery steps."],
  ["Intercom", "Planned", "#", "Clear-Com basics and communication etiquette."]
];

export default function Home() {
  return <>
    <section className="hero wrap">
      <div>
        <p className="eyebrow">No login required · Learn · Serve · Troubleshoot</p>
        <h1>Clear technical help, right when volunteers need it.</h1>
        <p className="lead">Anyone can open the volunteer portal and work through Hope-specific quick-start guides and troubleshooting. Administrator sign-in is only required to edit and publish content.</p>
        <div className="button-row"><Link className="button primary" href="/ask">Ask Hope Tech</Link><Link className="button secondary" href="/switcher">Switcher</Link><Link className="button secondary" href="/camera">Camera</Link><Link className="button secondary" href="/propresenter">ProPresenter</Link></div>
      </div>
      <div className="hero-visual"><div className="screen"><span className="preview">PREVIEW</span><span className="program">PROGRAM</span><div className="camera-box">CAM 1</div><div className="camera-box safe-box">CAM 2 · SAFE</div><div className="camera-box">CAM 3</div><div className="camera-box">PROPRESENTER</div></div></div>
    </section>

    <section className="wrap public-access-card">
      <div>
        <p className="eyebrow">Open volunteer access</p>
        <h2>Scan, choose a role, and start.</h2>
        <p>No account, assignment, check-in, or training record is required. Planning Center remains the system for scheduling and volunteer organization; Hope Tech stays focused on instructions, practice, and troubleshooting.</p>
        <strong>www.hopehermosa.org</strong>
      </div>
      <div className="portal-qr"><Image src="/hope-tech-qr.svg" alt="QR code for the Hope Tech volunteer portal" width={210} height={210}/><small>Post this in the booth or equipment area.</small></div>
    </section>

    <section className="wrap section">
      <p className="eyebrow">Choose your role</p><h2>What are you running today?</h2>
      <div className="card-grid">{roles.map(([name,status,href,desc]) => <Link className={`role-card ${href==="#" ? "disabled" : ""}`} href={href} key={name}><span className="status">{status}</span><h3>{name}</h3><p>{desc}</p></Link>)}</div>
    </section>
  </>;
}
