"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { hopeKnowledge, KnowledgeItem } from "@/lib/hopeKnowledge";

const prompts = [
  "Camera 3 is black",
  "The pastor skipped slides",
  "Should I fade or cut?",
  "The director said Ready One",
  "ProPresenter is frozen"
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function scoreItem(query: string, item: KnowledgeItem) {
  const normalizedQuery = normalize(query);
  const words = normalizedQuery.split(" ").filter(word => word.length > 2);
  const haystack = normalize(`${item.title} ${item.role} ${item.keywords.join(" ")} ${item.answer}`);
  let score = 0;

  item.keywords.forEach(keyword => {
    const normalizedKeyword = normalize(keyword);
    if (normalizedQuery.includes(normalizedKeyword)) score += 12;
    else if (normalizedKeyword.split(" ").every(word => normalizedQuery.includes(word))) score += 7;
  });

  words.forEach(word => {
    if (haystack.includes(word)) score += 1;
  });

  if (normalizedQuery.includes(normalize(item.role))) score += 2;
  return score;
}

export default function HopeTechAssistant() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  const results = useMemo(() => {
    if (!submitted.trim()) return [];
    return hopeKnowledge
      .map(item => ({ item, score: scoreItem(submitted, item) }))
      .filter(result => result.score > 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [submitted]);

  function ask(event: FormEvent) {
    event.preventDefault();
    setSubmitted(query.trim());
  }

  function usePrompt(prompt: string) {
    setQuery(prompt);
    setSubmitted(prompt);
  }

  const best = results[0]?.item;

  return <div className="assistant-shell">
    <div className="assistant-intro">
      <p className="eyebrow">Approved Hope procedures only</p>
      <h1>What is happening?</h1>
      <p className="lead">Describe the problem in plain language. This first version searches Hope's approved Switcher, Camera, ProPresenter, and safety procedures. It does not make up new technical steps.</p>
    </div>

    <form className="assistant-form" onSubmit={ask}>
      <label htmlFor="hope-question">Ask Hope Tech</label>
      <div className="assistant-input-row">
        <input id="hope-question" value={query} onChange={event => setQuery(event.target.value)} placeholder="Example: Camera 3 is black" autoComplete="off" />
        <button type="submit">Get help</button>
      </div>
    </form>

    <div className="prompt-chips" aria-label="Example questions">
      {prompts.map(prompt => <button key={prompt} onClick={() => usePrompt(prompt)}>{prompt}</button>)}
    </div>

    {!submitted && <section className="assistant-start-grid">
      <article><strong>1</strong><h2>Describe the symptom</h2><p>Use what you see or hear, such as “lyrics are behind” or “wrong camera is live.”</p></article>
      <article><strong>2</strong><h2>Do the safe action</h2><p>The answer starts with the immediate step that protects the service.</p></article>
      <article><strong>3</strong><h2>Escalate when needed</h2><p>Technical-lead actions are clearly separated from volunteer-safe actions.</p></article>
    </section>}

    {submitted && !best && <section className="assistant-no-result">
      <span className="escalate-label">No approved match</span>
      <h2>I do not have an approved procedure for that yet.</h2>
      <p>Keep the current working system state, avoid configuration changes or restarts, and contact the technical lead. Try describing the visible symptom rather than the suspected cause.</p>
      <div className="button-row"><Link className="button secondary" href="/troubleshooting">Open troubleshooting</Link></div>
    </section>}

    {best && <>
      <section className={`assistant-answer ${best.level === "Volunteer safe" ? "safe-answer" : best.level === "Stop and escalate" ? "stop-answer" : "escalate-answer"}`}>
        <div className="answer-meta"><span>{best.level}</span><small>{best.role}</small></div>
        <h2>{best.title}</h2>
        <p className="answer-summary">{best.answer}</p>
        {best.steps && <ol>{best.steps.map(step => <li key={step}>{step}</li>)}</ol>}
        <Link className="button primary" href={best.href}>Open full guide</Link>
      </section>

      {results.length > 1 && <section className="related-results">
        <p className="eyebrow">Related approved answers</p>
        <div className="related-grid">{results.slice(1).map(({ item }) => <button key={item.id} onClick={() => usePrompt(item.title)}><small>{item.role}</small><strong>{item.title}</strong><span>{item.answer}</span></button>)}</div>
      </section>}
    </>}

    <div className="assistant-boundary"><strong>Important:</strong> This assistant currently uses a fixed, approved knowledge base—not a general AI model. Smoke, sparks, burning smell, unsafe heat, or repeated power cycling always require immediate escalation.</div>
  </div>;
}
