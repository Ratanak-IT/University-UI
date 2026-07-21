import type { Metadata } from "next";

import Hero from "@/components/landing/Hero";
import WhyChoose from "@/components/landing/WhyChoose";
import Categories from "@/components/landing/Categories";
import About from "@/components/landing/About";
import FeaturedCourses from "@/components/landing/FeaturedCourses";
import HowItWorks from "@/components/landing/HowItWorks";
import Curriculum from "@/components/landing/Curriculum";
import CTABanner from "@/components/landing/CTABanner";
import Instructors from "@/components/landing/Instructors";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";

const title = "UML — Every Course, Every Skill, One Powerful Platform";
const description = "Learn Information Technology with UML: courses, curriculum, instructors, and a full university management system in one place.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { type: "website", siteName: "UML", title, description },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1">
        <Hero />
        <WhyChoose />
        <Categories />
        <About />
        <FeaturedCourses />
        <HowItWorks />
        <Curriculum />
        {/* <CTABanner /> */}
        {/* <Instructors /> */}
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
