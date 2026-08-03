"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import "./live.css";

const segments=[
 ["Preservice loop","Loop live","Keep the approved loop running. Prepare the welcome content."],
 ["Welcome","Stand by","Stay ready. Clear or advance only when cued."],
 ["Opening worship","Lyrics","Follow the worship leader. Hold each lyric until the phrase changes."],
 ["Meet & greet","Clear","Clear lyrics and prepare announcements."],
 ["Announcements","Slides","Take each announcement slide when cued."],
 ["Sermon","Sermon slides","Jump directly when the speaker skips ahead."],
 ["Communion","Calm content","Use only approved communion lyrics, scripture, or background."],
 ["Closing worship","Lyrics","Follow the worship leader, including repeated sections."],
 ["Ending loop","Loop live","Start the ending loop and confirm output."]
];
export default function ProPresenterLive(){const [current,setCurrent]=useState(0);useEffect(()=>{const v=localStorage.getItem("hope-pp-segment");if(v)setCurrent(Number(v)||0)},[]);function choose(i:number){setCurrent(i);localStorage.setItem("hope-pp-segment",String(i))}const item=segments[current];return <div className="pp-live-shell"><header><div><small>HOPE TECH · LIVE</small><h1>ProPresenter</h1></div><Link href="/propresenter">Exit Live Mode</Link></header><main><section className="pp-live-now"><small>CURRENT SEGMENT</small><h2>{item[0]}</h2><strong>{item[1]}</strong><p>{item[2]}</p></section><section className="pp-live-rules"><div><small>PACE</small><strong>Follow the room, not just the plan.</strong></div><div><small>RECOVERY</small><strong>Jump directly. Never panic-click Next.</strong></div><div><small>WHEN UNSURE</small><strong>Hold the current usable content or clear.</strong></div></section><section><small className="section-label">CHANGE SEGMENT</small><div className="pp-segment-grid">{segments.map((s,i)=><button className={i===current?"active":""} onClick={()=>choose(i)} key={s[0]}><span>{i+1}</span>{s[0]}</button>)}</div></section><nav><Link href="/propresenter">Full Guide</Link><Link className="urgent" href="/troubleshooting">Something Went Wrong</Link></nav></main></div>}
