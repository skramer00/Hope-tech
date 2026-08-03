import Link from "next/link";
import "./home.css";

const functions = [
  {
    name: "Video Switcher",
    href: "/switcher",
    description: "Camera selection, transitions, service phases, and recovery steps.",
    phases: ["Before service", "Worship", "Speaking", "Sermon", "Communion", "Closing"]
  },
  {
    name: "ProPresenter",
    href: "/propresenter",
    description: "Loops, lyrics, announcements, sermon slides, videos, and output help.",
    phases: ["Before service", "Preservice loop", "Worship", "Announcements", "Sermon", "Ending loop"]
  },
  {
    name: "Studio Cameras",
    href: "/camera",
    description: "Camera assignments, framing, tally, intercom cues, and live recovery.",
    phases: ["Setup", "Worship", "Speaking", "Sermon", "Communion", "Camera assignments"]
  }
];

const planned = ["Audio", "Livestream", "Lighting"];

export default function Home() {
  return <main className="home-launch">
    <section className="wrap home-intro">
      <p className="eyebrow">Hope Technical Ministries</p>
      <h1>What do you need help with?</h1>
      <p>Choose the system you are operating, or jump directly to troubleshooting.</p>
    </section>

    <section className="wrap home-primary-grid" aria-label="Available training areas">
      {functions.map((item) => <Link className="launch-card" href={item.href} key={item.name}>
        <div className="launch-card-top"><span>Guide</span><strong aria-hidden="true">→</strong></div>
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        <div className="launch-phases">{item.phases.map((phase) => <span key={phase}>{phase}</span>)}</div>
      </Link>)}
    </section>

    <section className="wrap urgent-launch">
      <div>
        <p className="eyebrow">Need help right now?</p>
        <h2>Start with the problem, not the manual.</h2>
      </div>
      <div className="urgent-actions">
        <Link className="urgent-card problem" href="/troubleshooting"><strong>I’m having a problem</strong><span>Use safe, step-by-step recovery guidance.</span></Link>
        <Link className="urgent-card assistant" href="/ask"><strong>Ask Hope Tech</strong><span>Describe what is happening in plain English.</span></Link>
      </div>
    </section>

    <section className="wrap reference-launch">
      <div className="reference-heading"><div><p className="eyebrow">Reference</p><h2>Find a system or location.</h2></div></div>
      <div className="reference-grid">
        <Link href="/equipment"><strong>Equipment Library</strong><span>All documented systems in one list.</span></Link>
        <Link href="/booth-map"><strong>Booth Map</strong><span>Find equipment by where it is located.</span></Link>
      </div>
    </section>

    <section className="wrap planned-strip">
      <strong>Coming next</strong>
      <div>{planned.map((item) => <span key={item}>{item}</span>)}</div>
    </section>
  </main>;
}
