"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  { label: "Equipment", href: "/equipment" },
  { label: "Help", href: "/troubleshooting" },
  { label: "Admin", href: "/admin" }
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function PublicNavigation() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.includes("/live")) return null;

  return <header className="site-header">
    <Link className="brand" href="/">
      <span className="brand-mark">HT</span>
      <span><strong>Hope Technical Ministries</strong><small>Training & Support</small></span>
    </Link>
    <nav aria-label="Primary navigation">
      {links.map(item => <Link className={isActive(pathname, item.href) ? "active" : ""} href={item.href} key={item.href}>{item.label}</Link>)}
    </nav>
  </header>;
}
