import type { Metadata } from "next";
import Link from "next/link";
import PublicNavigation from "@/components/PublicNavigation";
import "./globals.css";
import "./design-system.css";
import "./support.css";

export const metadata: Metadata = {
  title: "Hope Technical Ministries",
  description: "Quick-start training and first-line technical support for Hope Technical Ministries volunteers."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PublicNavigation />
        <main>{children}</main>
        <Link className="floating-support" href="/ask" aria-label="Open Hope Tech Assistant">
          <span>?</span><strong>Need Help?</strong><small>Hope Tech Assistant</small>
        </Link>
        <footer>
          <strong>Hope Technical Ministries</strong>
          <span>Quick-start training and volunteer-safe support</span>
        </footer>
      </body>
    </html>
  );
}
