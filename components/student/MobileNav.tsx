"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SidebarBrand, SidebarNavList } from "./SidebarNav";
import SidebarUser from "./SidebarUser";

/**
 * Navigation for screens below `lg`: a burger in the header that opens a
 * drawer over the content.
 *
 * The desktop rail (`SideBar.tsx`) is `hidden` below `lg`, so on a phone this
 * is the only way to reach any other page.
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Navigating is the whole point of the drawer, so any route change dismisses
  // it. Adjusted during render rather than in an effect so the panel is
  // already gone on the frame the new page paints, and so this never becomes
  // a setState-in-effect that could re-fire on an unrelated render.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    // Locking the body is what stops the page behind scrolling under your
    // finger while you drag through a long menu.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
        aria-controls="student-mobile-nav"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Kept mounted so the panel can slide rather than snap into place. */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          id="student-mobile-nav"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          tabIndex={-1}
          className={`absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col border-r border-border bg-card text-card-foreground shadow-2xl outline-none transition-transform duration-200 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <SidebarBrand />
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="mr-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <SidebarNavList onNavigate={() => setOpen(false)} />
          <SidebarUser />
        </div>
      </div>
    </>
  );
}
