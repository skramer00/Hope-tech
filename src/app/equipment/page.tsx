"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import "./equipment.css";

type Equipment = { id:string; name:string; slug:string; category:string; manufacturer:string|null; model:string|null; purpose:string|null; location:string|null; status:string };

export default function EquipmentPage(){
  const [items,setItems]=useState<Equipment[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{ void (async()=>{
    const {data}=await supabase.from("equipment_items").select("id,name,slug,category,manufacturer,model,purpose,location,status").eq("status","active").order("sort_order");
    setItems((data??[]) as Equipment[]); setLoading(false);
  })(); },[]);

  const groups=useMemo(()=>{
    const grouped=new Map<string,Equipment[]>();
    for(const item of items){
      const category=item.category || "Other";
      grouped.set(category,[...(grouped.get(category)??[]),item]);
    }
    return Array.from(grouped.entries());
  },[items]);

  return <main className="wrap section equipment-page">
    <div className="equipment-heading"><div><p className="eyebrow">Hope equipment</p><h1>Equipment library</h1><p className="lead">Choose a system for its quick reference, connected equipment, related task guides, and safe first-line troubleshooting.</p></div><Link className="button secondary" href="/">Back to portal</Link></div>
    {loading ? <p>Loading equipment…</p> : groups.length===0 ? <p>No equipment entries are currently published.</p> : <div className="equipment-list-groups">{groups.map(([category,categoryItems])=><section className="equipment-category" key={category}><div className="equipment-category-heading"><p className="eyebrow">{category}</p><h2>{categoryItems.length} {categoryItems.length===1 ? "system" : "systems"}</h2></div><div className="equipment-grid">{categoryItems.map(item=><Link href={`/equipment/${item.slug}`} className="equipment-card" key={item.id}><span>{item.category}</span><h2>{item.name}</h2><strong>{[item.manufacturer,item.model].filter(Boolean).join(" · ")}</strong><p>{item.purpose}</p><small>{item.location}</small></Link>)}</div></section>)}</div>}
  </main>;
}
