import Hero from "@/components/about-us/Hero";
import Intro from "@/components/about-us/Intro";
import Teachers from "@/components/about-us/Teachers";
import Team from "@/components/about-us/Team";
import VisionMission from "@/components/about-us/VisionMission";



export default function AboutPage() {
  return (
    <main className="bg-white">
      <Hero />
      <Intro />
      <VisionMission />
      <Teachers />
      <Team />
    </main>
  );
}
