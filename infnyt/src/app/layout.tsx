import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});


export const metadata: Metadata = {
  title: "InfinytTech — Software Engineering Partner",
  description:
    "We build software, cloud, and AI systems for teams who need to ship reliable products at scale.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className={`${plusJakarta.className} min-h-screen antialiased font-sans`}>
        {/* Global film grain — fixed over entire viewport */}
        <svg
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: 9999,
            opacity: 0.04,
            mixBlendMode: "overlay",
          }}
        >
          <filter id="global-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#global-noise)" />
        </svg>
        <Cursor />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
