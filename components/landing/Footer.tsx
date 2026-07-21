import Link from "next/link";

const COLS = [
  { title: "Quick Links", links: [ {label:"Home",href:"/"},{label:"About Us",href:"#about"},{label:"Courses",href:"#courses"},{label:"Contact Us",href:"#contact"} ] },
  { title: "Services", links: [ {label:"Courses",href:"#courses"},{label:"Assignments",href:"#"},{label:"Grades",href:"#"},{label:"Faculty",href:"#"} ] },
  { title: "Legal", links: [ {label:"Terms of Service",href:"#"},{label:"Privacy Policy",href:"#"},{label:"Instructors",href:"#instructors"},{label:"Success Story",href:"#"} ] },
];

export default function Footer() {
  return (
    <footer className="ums-section-gradient pt-24">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div className="grid gap-10 pb-8 sm:grid-cols-2 lg:grid-cols-4">
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-2xl font-bold text-ink">{col.title}</h3>
              <ul className="mt-7 space-y-3.5">
                {col.links.map((l) => (
                  <li key={l.label}><Link href={l.href} className="text-[18px] text-muted2 transition-colors hover:text-primary">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-2xl font-bold text-ink">Get in Touch</h3>
            <ul className="mt-7 space-y-4 text-[15px]">
              <li><p className="text-ink3">Email:</p><a href="mailto:support@uml.com" className="text-teal underline">support@uml.com</a></li>
              <li><p className="text-ink3">Phone:</p><a href="tel:+18001234567" className="text-teal underline">+1 (800) 123-4567</a></li>
              <li><p className="text-ink3">Address:</p><p className="text-ink3">Phnom Penh, Cambodia</p></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#eceff1] py-6 text-center text-[15px] text-muted">© UML. All rights reserved. Designed by University Management System</div>
      </div>
    </footer>
  );
}
