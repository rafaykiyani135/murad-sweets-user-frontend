import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ToastContainer from "@/components/ToastContainer";
import MixMatchModal from "@/components/MixMatchModal";
import CollectionModal from "@/components/CollectionModal";
import PartyTrayModal from "@/components/PartyTrayModal";
import SpecialtyModal from "@/components/SpecialtyModal";
import PithaModal from "@/components/PithaModal";
import MishtiPerPoundModal from "@/components/MishtiPerPoundModal";

import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Murad Sweets | Handcrafted Bangladeshi Sweets (Mithai) in USA",
  description: "Experience the premium taste of authentic, home-cooked Bangladeshi sweets. Order custom mix-and-match dry sweet boxes, rasmalai cake, specialty doi, party trays, and traditional winter pitha.",
  keywords: [
    "Bangladeshi sweets",
    "Mithai USA",
    "Halal sweets",
    "Rasmalai cake",
    "Custom sweet boxes",
    "Desi sweets",
    "Traditional Pitha",
    "Mishti",
    "Bengali Sweets"
  ],
  openGraph: {
    title: "Murad Sweets | Bangladeshi Sweets & Custom Mithai Boxes",
    description: "Premium, authentic home-cooked Bangladeshi sweets. Specializing in mix-and-match boxes, rasmalai cake, and traditional pitha.",
    url: "https://muradsweets.com",
    siteName: "Murad Sweets",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Murad Sweets | Premium Bangladeshi Mithai",
    description: "Authentic, handcrafted Bangladeshi sweets. Order custom mix-and-match boxes today.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col bg-cream text-primary-deep selection:bg-blush selection:text-primary">
        <Navbar />
        <main className="flex-1 flex flex-col pt-16">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <ToastContainer />
        <MixMatchModal />
        <CollectionModal />
        <PartyTrayModal />
        <SpecialtyModal />
        <PithaModal />
        <MishtiPerPoundModal />
      </body>
    </html>
  );
}
