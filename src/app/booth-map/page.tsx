import Link from "next/link";
import "./booth-map.css";

type Station = {
  name: string;
  description: string;
  href: string;
  className: string;
  status?: "live" | "planned";
};

const stations: Station[] = [
  {
    name: "Main Displays",
    description: "Multiview, program, preview, and confidence monitoring.",
    href: "/equipment/blackmagic-atem-2me",
    className: "displays",
    status: "live"
  },
  {
    name: "ProPresenter Mac",
    description: "Lyrics, sermon slides, videos, and service loops.",
    href: "/equipment/propresenter-mac",
    className: "propresenter",
    status: "live"
  },
  {
    name: "Video Switcher",
    description: "Blackmagic ATEM 2 M/E production switcher.",
    href: "/equipment/blackmagic-atem-2me",
    className: "switcher",
    status: "live"
  },
  {
    name: "Livestream Laptop",
    description: "Streaming output and service monitoring.",
    href: "/ask",
    className: "livestream",
    status: "planned"
  },
  {
    name: "Audio Console",
    description: "Yamaha QL5 audio control position.",
    href: "/ask",
    className: "audio",
    status: "planned"
  },
  {
    name: "Camera Control",
    description: "Camera monitoring, communication, and shot reference.",
    href: "/equipment/studio-cameras",
    className: "camera-control",
    status: "live"
  },
  {
    name: "Intercom",
    description: "Director communication with camera operators.",
    href: "/camera",
    className: "intercom",
    status: "planned"
  },
  {
    name: "Lighting Control",
    description: "Approved service looks and lighting cues.",
    href: "/ask",
    className: "lighting",
    status: "planned"
  }
];

export default function BoothMapPage() {
  return (
    <main className="wrap section booth-map-page">
      <div className="booth-map-heading">
        <div>
          <p className="eyebrow">Production booth</p>
          <h1>Click a station to get help.</h1>
          <p className="lead">This first-pass map shows the main systems in the booth. The exact physical arrangement can be refined after we document the full layout.</p>
        </div>
        <div className="button-row">
          <Link className="button secondary" href="/equipment">Equipment list</Link>
          <Link className="button primary" href="/ask">Ask Hope Tech</Link>
        </div>
      </div>

      <section className="booth-shell" aria-label="Clickable production booth map">
        <div className="booth-front">Front of booth · Facing sanctuary</div>
        <div className="booth-grid">
          {stations.map((station) => (
            <Link
              href={station.href}
              key={station.name}
              className={`booth-station ${station.className} ${station.status === "planned" ? "planned" : ""}`}
            >
              <span>{station.status === "planned" ? "Guide planned" : "Open guide"}</span>
              <strong>{station.name}</strong>
              <p>{station.description}</p>
            </Link>
          ))}
          <div className="booth-aisle"><span>Operator aisle</span></div>
        </div>
        <div className="booth-rear">Rear wall / booth entrance</div>
      </section>

      <section className="booth-map-note">
        <div>
          <p className="eyebrow">Map status</p>
          <h2>Useful now, easy to refine later.</h2>
        </div>
        <p>The stations are linked to the best current guide or help page. Planned systems will gain dedicated equipment pages as their training content is created.</p>
      </section>
    </main>
  );
}
