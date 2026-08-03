"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./equipment.css";

type Equipment = { id:string; name:string; slug:string; category:string; manufacturer:string|null; model:string|null; purpose:string|null; location:string|null; status:string };

export default function EquipmentPage(){
  const [items,setItems]=useState<Equipment[]>([]);
  const [loading,setLoading]=useState(true);
  const [query,setQuery]=useState("");

  useEffect(()=>{ void (async()=>{
    const {data}=await supabase.from("equipment_items").select("id,name,slug,category,manufacturer,model,purpose,location,status").eq("status","active").order("sort_order");
    setItems((data??[]) as Equipment[]); setLoading(false);
  })(); },[]);

  const filtered=items.filter(item=>`${item.name} ${item.category} ${item.manufacturer??""} ${item.model??""} ${item.purpose??""}`.toLowerCase().includes(query.toLowerCase()));

  return <main className="wrap section equipment-page">
    <div className="equipment-heading"><div><p className="eyebrow">Hope equipment</p><h1>Find the system you are using.</h1><p className="lead">Quick references, connected systems, related task guides, and safe first-line troubleshooting.</p></div><Link className="button secondary" href="/">Back to portal</Link></div>
    <label className="equipment-search">Search equipment<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Switcher, Camera 2, ProPresenter…"/></label>
    {loading ? <p>Loading equipment…</p> : <div className="equipment-grid">{filtered.map(item=><Link href={`/equipment/${item.slug}`} className="equipment-card" key={item.id}><span>{item.category}</span><h2>{item.name}</h2><strong>{[item.manufacturer,item.model].filter(Boolean).join(" · ")}</strong><p>{item.purpose}</p><small>{item.location}</small></Link>)}</div>}
  </main>;
}
