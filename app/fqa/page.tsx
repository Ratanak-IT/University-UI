// app/fqa/page.tsx
import Testimonials from "@/components/landing/Testimonials";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/landing/Footer";

export default function FQAPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* <Navbar /> */}
      <main className="flex-1">
        <Testimonials />
      </main>
      {/* <Footer /> */}
    </div>
  );
}