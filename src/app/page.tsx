import Image from "next/image";
import Link from "next/link";

const functions = [
  {
    name: "Video Switcher",
    status: "Live",
    href: "/switcher",
    description: "Choose cameras, control transitions, and keep the livestream program moving.",
    phases: ["Before Service", "Preservice", "Welcome", "Opening Worship", "Speaking Segments", "Sermon", "Communion", "Closing Worship", "Ending Loop"]
  },
  {
    name: "ProPresenter",
    status: "Live",
    href: "/propresenter",
    description: "Run lyrics, sermon slides, videos, and the preservice and ending loops.",
    phases: ["Before Service", "Preservice Loop", "Worship Lyrics", "Meet & Greet", "Announcements", "Sermon Slides", "Communion", "Closing Worship", "Ending Loop"]
  },
  {
    name: "Studio Cameras",
    status: "Live",
    href: "/camera",
    description: "Operate Cameras 1–3 using Hope’s framing, tally, intercom, and shot assignments.",
    phases: ["Setup & Headsets", "Preservice", "Welcome", "Worship", "Speaking Segments", "Sermon", "Communion", "Closing Worship", "Camera Assignments"]
  },
  {
    name: "Audio",
    status: "Planned",
    href: "#",
    description: "Yamaha QL5 operation, service cues, and safe first-line troubleshooting.",
    phases: ["Startup", "Sound Check", "Worship", "Speaking", "Sermon", "Communion", "Shutdown"]
  },
  {
    name: "Livestream",
    status: "Planned",
    href: "#",
    description: "Streaming laptop startup, monitoring, and common recovery procedures.",
    phases: ["Startup", "Preservice Check", "Go Live", "Monitor Service", "End Stream", "Shutdown"]
  },
  {
    name: "Lighting",
    status: "Planned",
    href: "#",
    description: "Approved service looks, cues, and safe recovery steps.",
    phases: ["Startup", "Preservice", "Worship", "Speaking", "Sermon", "Communion", "Closing", "Shutdown"]
  }
];

export default function Home() {
  return <>
    <section className="hero wrap home-hero">
      <div>
        <p className="eyebrow">No login required · Hope-specific volunteer support</p>
        <h1>Choose the system you are operating.</h1>
        <p className="lead">Each function is organized around the phases of a normal Hope service, so volunteers can find the right instructions without reading a full equipment manual.</p>
        <div className="button-row">
          <Link className="button primary" href="/ask">Ask Hope Tech</Link>
          <Link className="button secondary" href="/troubleshooting">I’m having a problem</Link>
          <Link className="button secondary" href="/booth-map">View booth map</Link>
        </div>
      </div>
      <div className="hero-visual"><div className="screen"><span className="preview">PREVIEW</span><span className="program">PROGRAM</span><div className="camera-box">CAM 1</div><div className="camera-box safe-box">CAM 2 · SAFE</div><div className="camera-box">CAM 3</div><div className="camera-box">PROPRESENTER</div></div></div>
    </section>

    <section className="wrap section function-section">
      <p className="eyebrow">Equipment and function first</p>
      <h2>What are you running?</h2>
      <div className="function-grid">
        {functions.map((item) => {
          const card = <article className={`function-card ${item.href === "#" ? "disabled" : ""}`}>
            <header><div><span className="status">{item.status}</span><h3>{item.name}</h3></div><span className="function-arrow">→</span></header>
            <p>{item.description}</p>
            <div className="phase-list">{item.phases.map((phase) => <span key={phase}>{phase}</span>)}</div>
          </article>;
          return item.href === "#" ? <div key={item.name}>{card}</div> : <Link className="function-link" href={item.href} key={item.name}>{card}</Link>;
        })}
      </div>
    </section>

    <section className="wrap support-tools">
      <div><p className="eyebrow">Reference and support</p><h2>Need something beyond the current task?</h2></div>
      <div className="support-tool-grid">
        <Link href="/troubleshooting"><strong>Troubleshoot a problem</strong><span>Follow safe recovery guidance.</span></Link>
        <Link href="/equipment"><strong>Equipment library</strong><span>See every documented system.</span></Link>
        <Link href="/booth-map"><strong>Booth map</strong><span>Find systems by physical location.</span></Link>
        <Link href="/ask"><strong>Ask Hope Tech</strong><span>Get concise Hope-specific help.</span></Link>
      </div>
    </section>

    <section className="wrap public-access-card home-public-card">
      <div>
        <p className="eyebrow">Open volunteer access</p>
        <h2>Scan the code and start.</h2>
        <p>No account, assignment, check-in, or training record is required. Planning Center remains the system for scheduling and volunteer organization.</p>
        <strong>www.hopehermosa.org</strong>
      </div>
      <div className="portal-qr"><Image src="/hope-tech-qr.svg" alt="QR code for the Hope Tech volunteer portal" width={210} height={210}/><small>Post this in the booth or equipment area.</small></div>
    </section>
  </>;
}
