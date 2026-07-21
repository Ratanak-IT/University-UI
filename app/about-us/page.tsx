import Hero from "@/components/about-us/Hero";
import Teachers from "@/components/about-us/Teachers";
import Team from "@/components/about-us/Team";
import VisionMission from "@/components/about-us/VisionMission";
import Navbar from "@/components/layout/Navbar";



export default function AboutPage() {
  return (
    <main className="bg-white">
      <Navbar/>
      <Hero />
      {/* <Intro /> */}
      <VisionMission />
      <Teachers />
      <Team />
    </main>
  );
}
