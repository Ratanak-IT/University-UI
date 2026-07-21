"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#about" },
  { label: "Our Courses", href: "#courses" },
  { label: "Instructors", href: "#instructors" },
  { label: "Contact Us", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-3.5 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-rm.png" alt="UML logo" width={44} height={40} className="h-10 w-auto object-contain" />
          <span className="text-2xl font-bold tracking-tight text-primary">UML</span>
        </Link>

        <ul className="hidden items-center gap-9 lg:flex">
          {LINKS.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className="text-[15px] font-medium text-slate-600 transition-colors hover:text-primary">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center lg:flex">
          <Link href="/dashboard/teacher" className="rounded-xl bg-brandblue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary">
            Get Started
          </Link>
        </div>

        <button type="button" onClick={() => setOpen((v) => !v)} className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 lg:hidden" aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <ul className="mx-auto flex max-w-[1320px] flex-col gap-1 px-6 py-3">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-2.5 text-[15px] font-medium text-slate-600 hover:bg-slate-50 hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <Link href="/dashboard/teacher" onClick={() => setOpen(false)} className="block rounded-xl bg-brandblue px-4 py-2.5 text-center text-sm font-semibold text-white">
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
