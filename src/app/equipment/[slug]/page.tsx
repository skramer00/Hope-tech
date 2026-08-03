"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "../equipment.css";

type Equipment={name:string;slug:string;category:string;manufacturer:string|null;model:string|null;purpose:string|null;location:string|null;quick_reference:string[];connections:string[];related_slugs:string[];notes:string|null;manual_url:string|null};
type Related={title:string;slug:string;content_type:string;summary:string|null;safety_level:string};

export default function EquipmentDetail(){
 const params=useParams<{slug:string}>(); const [item,setItem]=useState<Equipment|null>(null); const [related,setRelated]=useState<Related[]>([]); const [loading,setLoading]=useState(true);
 useEffect(()=>{void (async()=>{const {data}=await supabase.from("equipment_items").select("*").eq("slug",params.slug).eq("status","active").single(); const equipment=data as Equipment|null; setItem(equipment); if(equipment?.related_slugs?.length){const result=await supabase.from("content_items").select("title,slug,content_type,summary,safety_level").in("slug",equipment.related_slugs).eq("status","published"); setRelated((result.data??[]) as Related[]);} setLoading(false);})();},[params.slug]);
 if(loading)return <main className="wrap section"><p>Loading equipment…</p></main>;
 if(!item)return <main className="wrap section"><h1>Equipment not found.</h1><Link className="button secondary" href="/equipment">Return to equipment</Link></main>;
 return <main className="wrap section equipment-detail">
  <div className="equipment-heading"><div><p className="eyebrow">{item.category} · {item.location}</p><h1>{item.name}</h1><p className="lead">{item.purpose}</p></div><div className="equipment-model"><small>System</small><strong>{[item.manufacturer,item.model].filter(Boolean).join(" · ")}</strong></div></div>
  <section className="equipment-section"><p className="eyebrow">Quick reference</p><h2>What volunteers need to remember</h2><ol className="equipment-quick">{item.quick_reference.map((text,i)=><li key={text}><span>{i+1}</span><p>{text}</p></li>)}</ol></section>
  <div className="equipment-columns"><section className="equipment-section"><p className="eyebrow">Connected systems</p><h2>What this works with</h2><ul>{item.connections.map(c=><li key={c}>{c}</li>)}</ul></section><section className="equipment-section"><p className="eyebrow">Safety boundary</p><h2>Operate, do not reconfigure</h2><p>Use the approved live-service controls and procedures. Do not change routing, firmware, display configuration, or cabling during a service unless directed by a technical lead.</p></section></div>
  {related.length>0&&<section className="equipment-section"><p className="eyebrow">Related help</p><h2>Tasks and troubleshooting</h2><div className="related-equipment-grid">{related.map(r=><Link href={`/guides/${r.slug}`} key={r.slug}><span>{r.content_type.replace("_"," ")}</span><h3>{r.title}</h3><p>{r.summary}</p></Link>)}</div></section>}
  <div className="guide-footer-actions"><Link className="button secondary" href="/equipment">All equipment</Link><Link className="button primary" href="/ask">Ask Hope Tech</Link></div>
 </main>;
}
