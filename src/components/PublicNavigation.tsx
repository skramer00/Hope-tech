"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const primary = [
  { label: "Home", href: "/" },
  { label: "Equipment", href: "/equipment" },
  { label: "Booth Map", href: "/booth-map" },
  { label: "Troubleshooting", href: "/troubleshooting" },
  { label: "Admin", href: "/admin" }
];

const areas = [
  { label: "Media Room", description: "Switcher, ProPresenter, livestream", href: "/", routes: ["/switcher", "/propresenter", "/ask"] },
  { label: "Audio Booth", description: "Console and audio systems", href: "/equipment#audio", routes: ["/audio"] },
  { label: "Stage & Cameras", description: "Studio cameras and stage feeds", href: "/camera", routes: ["/camera"] },
  { label: "All Systems", description: "Complete equipment reference", href: "/equipment", routes: ["/equipment", "/booth-map"] }
];

function isActive(pathname: string, href: string, routes: string[] = []) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`) || routes.some(route => pathname === route || pathname.startsWith(`${route}/`));
}

export default function PublicNavigation() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isLiveMode = pathname.includes("/live");

  if (isAdmin || isLiveMode) return null;

  return <>
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-mark">HT</span>
        <span><strong>Hope Technical Ministries</strong><small>Training & Support</small></span>
      </Link>
      <nav aria-label="Primary navigation">
        {primary.map(item => <Link className={isActive(pathname, item.href) ? "active" : ""} href={item.href} key={item.href}>{item.label}</Link>)}
      </nav>
    </header>
    <nav className="area-navigation" aria-label="Technical areas">
      <div className="area-navigation-inner">
        {areas.map(area => <Link className={isActive(pathname, area.href, area.routes) ? "active" : ""} href={area.href} key={area.label}>
          <strong>{area.label}</strong>
          <small>{area.description}</small>
        </Link>)}
      </div>
    </nav>
  </>;
}
