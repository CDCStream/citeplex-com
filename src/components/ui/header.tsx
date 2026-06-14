"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { AuthNav } from "@/components/ui/auth-nav";
import { TOOL_GROUPS } from "@/lib/tools-nav";

const navigation = [
  { name: "Styles", href: "/styles" },
  { name: "Pricing", href: "/pricing" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center group" aria-label="CitePlex home">
          <Logo
            className="gap-2.5"
            markClassName="h-9 w-9 transition-transform group-hover:scale-105"
            wordmarkClassName="text-2xl"
          />
        </Link>

        <div className="hidden md:flex md:items-center md:gap-7">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}

          {/* Tools dropdown */}
          <div ref={toolsRef} className="relative">
            <button
              type="button"
              onClick={() => setToolsOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Products
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
            </button>

            {toolsOpen && (
              <div className="absolute right-0 top-full mt-3 w-[520px] rounded-2xl border border-border bg-background p-4 shadow-lg">
                <Link
                  href="/tools"
                  onClick={() => setToolsOpen(false)}
                  className="mb-3 flex items-center justify-between rounded-lg px-2 py-1.5 text-[12px] font-medium text-primary hover:bg-muted/50"
                >
                  View all products
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <div className="grid grid-cols-2 gap-4">
                  {TOOL_GROUPS.map((group) => (
                    <div key={group.label}>
                      <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {group.label}
                      </p>
                      <ul className="space-y-0.5">
                        {group.tools.map((tool) => (
                          <li key={tool.href}>
                            <Link
                              href={tool.href}
                              onClick={() => setToolsOpen(false)}
                              className="flex items-start justify-between gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-muted/60"
                            >
                              <div>
                                <span className="text-[13px] font-medium">{tool.name}</span>
                                <p className="text-[11px] text-muted-foreground">{tool.desc}</p>
                              </div>
                              {tool.tag && (
                                <span className="mt-0.5 shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                                  {tool.tag}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:flex md:items-center md:gap-3">
          <AuthNav />
        </div>

        <button
          type="button"
          className="md:hidden rounded-lg p-2 text-muted-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 max-h-[80vh] overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <p className="mt-4 mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Products
          </p>
          {TOOL_GROUPS.map((group) => (
            <div key={group.label} className="mb-3">
              <p className="px-3 py-1 text-[11px] text-zinc-400">{group.label}</p>
              {group.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="block rounded-lg px-3 py-2 text-sm text-muted-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          ))}

          <Link
            href="/generate"
            className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background"
            onClick={() => setMobileMenuOpen(false)}
          >
            Start citing
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </header>
  );
}
