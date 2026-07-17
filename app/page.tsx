import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import Institutions from "@/components/landing/Institutions";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Roles from "@/components/landing/Roles";
import Testimonials from "@/components/landing/Testimonials";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const title = "UMS — Run the whole term from one place";
const description =
  "Timetables, enrollment, attendance, and grades for universities. Built for registrars who are tired of spreadsheets.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    siteName: "UMS",
    title,
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hook */}
        <Hero />
        <Institutions />

        {/* Value */}
        <Features />
        <HowItWorks />
        <Roles />

        {/* Proof */}
        <Testimonials />

        {/* Convert */}
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
