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
              {/* Content protection is deliberately NOT applied here.
                  Wrapping the whole app blocked right-click and raised the
                  blackout on public pages like the home and about pages, where
                  there is nothing to protect and it only gets in the way.
                  Protection belongs to the file viewer itself — see
                  SecureFileViewerModal, which enables it while a file is open. */}
              {/* <Navbar/> */}
              {children}
              {/* <Footer /> */}
              <ScrollToTopButton />
            </ToastProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}