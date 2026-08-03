import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hope Technical Ministries",
  description: "Volunteer training and first-line technical support for Hope Technical Ministries."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/">
            <span className="brand-mark">HT</span>
            <span><strong>Hope Technical Ministries</strong><small>Training & Support</small></span>
          </Link>
          <nav><Link href="/">Tasks & Roles</Link><Link href="/equipment">Equipment</Link><Link href="/ask">Ask Hope Tech</Link><Link href="/troubleshooting">Help</Link></nav>
        </header>
        <main>{children}</main>
        <footer>Hope Technical Ministries · Volunteer-safe guidance for live services</footer>
      </body>
    </html>
  );
}
