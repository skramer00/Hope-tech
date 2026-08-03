"use client";

import Link from "next/link";
import {useEffect,useState} from "react";
import "./live.css";

const roles={
 "1":{title:"Primary close",mission:"Stay with the speaker or main singer.",priority:"Medium or close shot",fallback:"Hold a clean speaker shot",avoid:"Reframing while live"},
 "2":{title:"Safe wide / motion",mission:"Provide the dependable wide and cover larger movement.",priority:"Wide stage or room",fallback:"Centered safe wide",avoid:"Constant zooming"},
 "3":{title:"Side close-ups",mission:"Give the director an alternate close angle.",priority:"Supplemental close-up",fallback:"Steady alternate speaker shot",avoid:"Copying Camera 1 exactly"}
};

export default function CameraLivePage(){
 const [camera,setCamera]=useState("1");
 const [tally,setTally]=useState(false);
 useEffect(()=>{const saved=localStorage.getItem("hope-camera-position");if(saved&&roles[saved as keyof typeof roles])setCamera(saved)},[]);
 function choose(n:string){setCamera(n);localStorage.setItem("hope-camera-position",n)}
 const role=roles[camera as keyof typeof roles];
 return <main className={`camera-live ${tally?"is-live":""}`}>
  <header><div><p>Hope Technical Ministries</p><h1>Camera {camera}</h1></div><Link href="/camera">Exit Live Mode</Link></header>
  <nav aria-label="Choose camera">{Object.keys(roles).map(n=><button className={camera===n?"active":""} key={n} onClick={()=>choose(n)}>Camera {n}</button>)}</nav>
  <section className="tally-panel"><button onClick={()=>setTally(!tally)}><span className="tally-light"/>{tally?"RED TALLY — YOU ARE LIVE":"TALLY OFF — PREPARE YOUR NEXT SHOT"}</button><p>{tally?"Hold steady. Do not move or zoom unless the director directs you.":"Move calmly, focus, frame, settle, and wait for the director."}</p></section>
  <section className="mission-panel"><small>Your mission</small><h2>{role.title}</h2><p>{role.mission}</p><div className="mission-grid"><article><span>Priority shot</span><strong>{role.priority}</strong></article><article><span>Safe fallback</span><strong>{role.fallback}</strong></article><article><span>Avoid</span><strong>{role.avoid}</strong></article></div></section>
  <section className="live-cues"><h2>Director cues</h2><div><article><strong>READY {camera}</strong><p>Finish the shot and hold.</p></article><article><strong>TAKE {camera}</strong><p>Expect red tally. Stay steady.</p></article><article><strong>HOLD</strong><p>Do not move or zoom.</p></article><article><strong>CLEAR</strong><p>You may calmly reset off-air.</p></article></div></section>
  <footer><div><strong>Not ready?</strong><span>Say “Camera {camera} not ready.”</span></div><Link href="/camera#troubleshooting">Camera help</Link></footer>
 </main>
}
