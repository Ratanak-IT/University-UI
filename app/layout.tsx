import type { Metadata } from "next";
import { Google_Sans_Flex, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton"; // <--- 1. Import component

const googleSans = Google_Sans_Flex({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "UML — University Management System", template: "%s · UML" },
  description: "Every Course, Every Skill — One Powerful Platform.",
};

import ReduxProvider from "@/components/providers/ReduxProvider";
import { ToastProvider } from "@/components/shared/Toast";
import { GlobalContentProtection } from "@/components/shared/GlobalContentProtection";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${googleSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider>
              <GlobalContentProtection>
                {/* <Navbar/> */}
                {children}
                {/* <Footer /> */}
                <ScrollToTopButton /> {/* <--- 2. Add component here */}
              </GlobalContentProtection>
            </ToastProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}