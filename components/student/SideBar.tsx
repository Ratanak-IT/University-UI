"use client";

import { SidebarBrand, SidebarNavList } from "./SidebarNav";
import SidebarUser from "./SidebarUser";

/**
 * The permanent rail, from `lg` up. Below that the same navigation is served
 * by {@link MobileNav} as a drawer, so a phone gets the whole screen width
 * for content instead of losing 260px of it.
 *
 * Unlike the teacher rail, this one has no collapse affordance, so it can
 * render the exact same brand/nav/footer pieces the drawer does rather than
 * keeping a second copy of the markup around.
 */
export default function SidebarStudent() {
  return (
    <aside className="hidden h-screen w-65 flex-col border-r border-border bg-card text-card-foreground transition-colors lg:flex">
      <SidebarBrand />
      <SidebarNavList />
      <SidebarUser />
    </aside>
  );
}
