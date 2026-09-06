"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "./BrandMark";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/upload", label: "New Transformation" },
  { href: "/projects", label: "My Girls" },
  { href: "/account", label: "Account" },
];

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();
  // In demo mode (no Supabase configured) there's no session to check, but
  // every route is still reachable, so show the full app nav rather than a
  // permanent logged-out state.
  const showAppLinks = !supabase || isLoggedIn;

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(Boolean(data.user)));

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session?.user));
    });

    return () => subscription.subscription.unsubscribe();
  }, [supabase]);

  return (
    <header className="sticky top-0 z-40 border-b border-nude-blush/10 bg-black-cherry-900/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <BrandMark />
        {showAppLinks ? (
          <nav className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-nude-blush/70 transition-colors hover:text-nude-blush"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : (
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-nude-blush/70 transition-colors hover:text-nude-blush"
            >
              Log In
            </Link>
            <Link href="/signup" className="btn-secondary !px-5 !py-2 text-xs">
              Get Started
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
