"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sparkles, LayoutDashboard, History, Plus, Zap } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/create", label: "Create", icon: Plus },
  { href: "/history", label: "History", icon: History },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[rgba(255,0,128,0.15)] rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FF0080] to-[#CC0066] rounded-lg flex items-center justify-center glow-pink group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gradient-luxury hidden sm:block">
              BaddieFactory
            </span>
            <span className="text-[#F5D28A] text-xs font-medium hidden sm:block">AI</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[rgba(255,0,128,0.15)] text-[#FF0080] border border-[rgba(255,0,128,0.3)]"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:block">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <Link
            href="/create"
            className="btn-pink text-sm px-4 py-2 flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span className="hidden sm:block">New Model</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
