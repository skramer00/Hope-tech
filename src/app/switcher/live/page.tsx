"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const segments = [
  {name:"Preservice loop", transition:"ProPresenter", primary:"ProPresenter", next:"Camera 2", guidance:"Keep the loop live. Put Camera 2 in Preview and be ready for the welcome."},
  {name:"Welcome", transition:"CUT", primary:"Camera 1", next:"Camera 3 or 2", guidance:"Favor Camera 1. Use Camera 3 only after it settles. Camera 2 is your safe fallback."},
  {name:"Opening worship", transition:"FADE", primary:"Cameras 1, 2, 3", next:"Keys or drums when intentional", guidance:"Use settled shots and hold them long enough to feel calm. Add Cameras 5 and 6 selectively."},
  {name:"Meet & greet", transition:"CUT", primary:"Camera 2", next:"Stay wide", guidance:"Use the room-wide shot. Do not chase individuals or switch rapidly."},
  {name:"Announcements", transition:"CUT", primary:"Camera 1", next:"ProPresenter when cued", guidance:"Stay with the presenter. Take slides only after they are visible and confirmed in Preview."},
  {name:"Sermon", transition:"CUT", primary:"Camera 1", next:"Camera 3 sparingly", guidance:"Keep switching minimal. Use Camera 2 if the speaker moves beyond the prepared close shot."},
  {name:"Communion", transition:"CALM FADE", primary:"Wide / pastor / musicians", next:"Camera 2 available", guidance:"Hold quiet, intentional shots. Avoid visible camera movement and distracting close-ups."},
  {name:"Closing worship", transition:"FADE", primary:"Cameras 1, 2, 3", next:"Musician shots", guidance:"Return to worship pacing. Preview every shot and wait for movement to settle."},
  {name:"Ending loop", transition:"ProPresenter", primary:"ProPresenter", next:"Camera 2", guidance:"Take the ending loop, place Camera 2 in Preview, and leave the switcher ready for the next service."}
];

export default function LiveServiceMode(){
  const [current,setCurrent]=useState(0);
  useEffect(()=>{const saved=window.localStorage.getItem("hope-switcher-segment");if(saved)setCurrent(Math.min(Number(saved)||0,segments.length-1));},[]);
  function choose(index:number){setCurrent(index);window.localStorage.setItem("hope-switcher-segment",String(index));}
  const segment=segments[current];
  return <div className="service-mode-shell">
    <header className="service-mode-header">
      <div><p>HOPE TECH · LIVE SERVICE MODE</p><h1>Switcher Director</h1></div>
      <Link href="/switcher" className="service-exit">Exit Service Mode</Link>
    </header>

    <main className="service-mode-main">
      <section className="service-safety-bar"><span>SAFE SHOT</span><strong>CAMERA 2</strong><em>When unsure, stay live or go wide.</em></section>

      <section className="segment-picker" aria-label="Select current service segment">
        {segments.map((item,index)=><button key={item.name} onClick={()=>choose(index)} className={index===current?"active":""}><span>{index+1}</span>{item.name}</button>)}
      </section>

      <section className="current-segment-card">
        <div className="current-segment-top"><div><p>CURRENT SEGMENT</p><h2>{segment.name}</h2></div><div className="transition-command"><span>TRANSITION</span><strong>{segment.transition}</strong></div></div>
        <div className="live-guidance-grid">
          <article><span>PRIMARY</span><strong>{segment.primary}</strong></article>
          <article><span>PREPARE NEXT</span><strong>{segment.next}</strong></article>
        </div>
        <p className="segment-guidance">{segment.guidance}</p>
      </section>

      <section className="live-rule-card">
        <div><span>1</span><p><strong>Cue</strong> the next camera.</p></div>
        <div><span>2</span><p><strong>Preview</strong> and wait until settled.</p></div>
        <div><span>3</span><p><strong>Switch</strong> using the instruction above.</p></div>
      </section>

      <nav className="service-action-grid">
        <Link href="/switcher/panel">Panel Guide</Link>
        <Link href="/troubleshooting" className="urgent">Something Went Wrong</Link>
      </nav>

      <section className="service-reminder"><strong>Never take a black, moving, unfocused, or unconfirmed source.</strong><span>Do not restart or reconfigure the ATEM during a service.</span></section>
    </main>
  </div>;
}
