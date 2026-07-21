import { Mail, Phone, MapPin } from "lucide-react";

const columns = [
  {
    title: "Quick Links",
    links: ["Home", "About Us", "Courses", "Contact us"],
  },
  {
    title: "Services",
    links: ["Courses", "Assignments", "Grades", "Faculty"],
  },
  {
    title: "Legal",
    links: ["Terms of Service", "Privacy Policy", "Instructors", "Success Story"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t border-border pt-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 pb-12 md:grid-cols-4">
        
        {/* Dynamic Link Columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-bold text-foreground">{col.title}</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {col.links.map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="transition hover:text-primary block py-0.5"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact Column with Lucide Icons */}
        <div>
          <h4 className="font-bold text-foreground">Get in Touch</h4>
          <div className="mt-4 space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-2.5">
              <Mail className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Email</p>
                <a href="mailto:support@uml.com" className="hover:text-primary transition underline decoration-primary/40">
                  support@uml.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Phone</p>
                <a href="tel:+18001234567" className="hover:text-primary transition underline decoration-primary/40">
                  +1 (800) 123-4567
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Address</p>
                <p>Phnom Penh, Cambodia</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-border py-6 text-center text-sm text-muted-foreground/80">
        © UML. All rights reserved. Designed by University Management System
      </div>
    </footer>
  );
}