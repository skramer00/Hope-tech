import { Suspense } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<main className="wrap section"><p>Loading Hope Tech administration…</p></main>}>
    {children}
    <Link href="/admin/generate" style={{position:"fixed",right:18,bottom:18,zIndex:60,padding:"13px 17px",borderRadius:999,background:"#d5a84a",color:"#13241f",fontWeight:900,textDecoration:"none",boxShadow:"0 12px 32px rgba(0,0,0,.2)"}}>Generate guide with AI</Link>
  </Suspense>;
}
