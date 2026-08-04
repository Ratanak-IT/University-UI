"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Curriculum", href: "/#curriculum" },
  { label: "FQA", href: "/#fqa" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <header className="bg-primary text-primary-foreground transition-colors duration-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10">
            <Image src="/logo-rm.png" alt="UMS Logo" width={100} height={100} className="h-6 w-6 object-contain" />
          </div>
          <span className="text-xl font-bold tracking-wide">UMS</span>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-10 text-sm font-medium md:flex">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={
                    isActive
                      ? "border-b-2 border-secondary pb-1 text-secondary"
                      : "text-primary-foreground/90 transition hover:text-secondary"
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop Right Section */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full p-2 text-primary-foreground/90 transition hover:bg-primary-foreground/10 hover:text-secondary"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link href="/login">
            <button className="rounded-md bg-secondary px-5 py-2 text-sm font-semibold text-secondary-foreground transition hover:brightness-95">
              Login
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="p-2 text-primary-foreground focus:outline-none md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-card px-6 py-4 text-card-foreground md:hidden">
          <ul className="flex flex-col gap-4 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={
                      isActive
                        ? "block border-l-4 border-secondary pl-3 text-secondary"
                        : "block pl-4 text-muted-foreground transition hover:text-foreground"
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="flex items-center justify-between pl-4">
              <span className="text-muted-foreground">Theme</span>
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </li>
            <li>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="mt-4 w-full rounded-md bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground transition hover:brightness-95">
                  Apply Now
                </button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}