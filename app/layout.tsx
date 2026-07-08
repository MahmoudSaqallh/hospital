import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Navber from "./components/Navber/Navber";
import Footer from "./components/Footer/Footer";
import AnalyticsTracker from "./components/AnalyticsTracker";
import ScrollToTopButton from "./components/ScrollToTopButton";
import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton";


const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "جدول العيادات - جمعية الخدمة العامة",
  description: "جدول العيادات التخصصية - جمعية الخدمة العامة ومجموعة مستشفياتها",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${ibmPlexArabic.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col font-sans bg-canvas text-ink">
        {/* Decorative background */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="blob animate-float-slow" style={{ top: "-6rem", right: "-4rem", width: "28rem", height: "28rem", background: "rgba(8,145,178,0.18)" }} />
          <div className="blob" style={{ bottom: "-8rem", left: "-6rem", width: "32rem", height: "32rem", background: "rgba(34,184,207,0.14)" }} />
        </div>
        <AnalyticsTracker />
        <Navber/>
        <main className="relative z-0 flex-1 pt-[84px] sm:pt-[92px]">{children}</main>
        <Footer/>
        <WhatsAppFloatingButton />
        <ScrollToTopButton />
      </body>
    </html>
  );
}