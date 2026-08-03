import Link from "next/link";
import "./home.css";

const rooms = [
  {
    name: "Media Room",
    description: "Video switching, presentation, livestream, and production monitoring.",
    devices: [
      { name: "Video Switcher", href: "/switcher", note: "Run cameras and transitions" },
      { name: "ProPresenter", href: "/propresenter", note: "Lyrics, slides, videos, and loops" },
      { name: "Livestream", href: "/equipment", note: "Equipment reference available; guide coming next" }
    ]
  },
  {
    name: "Audio Booth",
    description: "Sound console and audio systems for the room and livestream.",
    devices: [
      { name: "Audio Console", href: "/equipment", note: "Equipment reference available; guide coming next" }
    ]
  },
  {
    name: "Stage & Cameras",
    description: "Operated studio cameras and fixed stage camera feeds.",
    devices: [
      { name: "Studio Cameras 1–3", href: "/camera", note: "Framing, tally, intercom, and assignments" },
      { name: "Special Stage Camera", href: "/equipment", note: "Baptisms or ASL interpreter" },
      { name: "Keyboard & Drum Cameras", href: "/equipment", note: "Fixed musician shots" }
    ]
  }
];

export default function Home() {
  return <main className="home-launch">
    <section className="wrap home-intro">
      <p className="eyebrow">Hope Technical Ministries</p>
      <h1>Where are you working?</h1>
      <p>Choose the room, then select the system you need.</p>
    </section>

    <section className="wrap room-grid" aria-label="Technical rooms and systems">
      {rooms.map(room => <article className="room-card" key={room.name}>
        <header><div><span>Room</span><h2>{room.name}</h2><p>{room.description}</p></div></header>
        <div className="device-list">
          {room.devices.map(device => <Link href={device.href} key={device.name}>
            <div><strong>{device.name}</strong><span>{device.note}</span></div><b aria-hidden="true">→</b>
          </Link>)}
        </div>
      </article>)}
    </section>

    <section className="wrap urgent-launch">
      <div><p className="eyebrow">Need help now?</p><h2>Start with what is going wrong.</h2></div>
      <div className="urgent-actions">
        <Link className="urgent-card problem" href="/troubleshooting"><strong>Troubleshoot a problem</strong><span>Follow safe recovery steps.</span></Link>
        <Link className="urgent-card assistant" href="/ask"><strong>Ask Hope Tech</strong><span>Describe the issue in plain English.</span></Link>
      </div>
    </section>

    <section className="wrap reference-launch">
      <Link href="/equipment"><strong>All Equipment</strong><span>Browse every documented system.</span></Link>
      <Link href="/booth-map"><strong>Booth Map</strong><span>Find equipment by location.</span></Link>
    </section>
  </main>;
}
