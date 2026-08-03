"use client";

import { useEffect, useMemo, useState } from "react";

const items = [
  "Physical switcher controller is connected and responsive",
  "Livestream laptop is on and the stream preview looks normal",
  "ProPresenter feed is visible in Preview",
  "Camera 1 is framed and communicating",
  "Camera 2 is available as the safe wide shot",
  "Camera 3 is framed and communicating",
  "Cameras 4, 5, and 6 are visible when needed",
  "Intercom is working with Camera 1 and Camera 3 operators",
  "Program is on the preservice loop and Preview is on Camera 2"
];

const storageKey = "hope-tech-switcher-checklist";

export default function PreServiceChecklist() {
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try { setChecked(JSON.parse(saved)); } catch { /* ignore invalid saved data */ }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked]);

  const complete = useMemo(() => checked.filter(Boolean).length, [checked]);

  function toggle(index: number) {
    setChecked(current => current.map((value, i) => i === index ? !value : value));
  }

  function reset() {
    setChecked(items.map(() => false));
  }

  return <section className="checklist-card" aria-labelledby="pre-service-title">
    <div className="checklist-heading">
      <div><p className="eyebrow">Before service</p><h2 id="pre-service-title">Complete the booth check.</h2></div>
      <div className="progress-pill">{complete} of {items.length}</div>
    </div>
    <div className="checklist-items">
      {items.map((item, index) => <label className={checked[index] ? "check-item checked" : "check-item"} key={item}>
        <input type="checkbox" checked={checked[index]} onChange={() => toggle(index)} />
        <span className="custom-check" aria-hidden="true">✓</span>
        <span>{item}</span>
      </label>)}
    </div>
    <div className="checklist-footer">
      <span>{complete === items.length ? "Ready for service." : "Progress saves on this device."}</span>
      <button type="button" onClick={reset}>Reset checklist</button>
    </div>
  </section>;
}
