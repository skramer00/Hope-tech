import { Suspense } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<main className="wrap section"><p>Loading Hope Tech administration…</p></main>}>{children}</Suspense>;
}
