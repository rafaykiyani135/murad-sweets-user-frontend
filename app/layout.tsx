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
import FulfillmentModal from "@/components/FulfillmentModal";
import FulfillmentGuard from "@/components/FulfillmentGuard";

import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Murad Sweets | Authentic Bangladeshi Mishti & Bengali Mithai in USA",
  description: "Experience the premium taste of authentic, home-cooked Bangladeshi sweets in Houston, Texas. Order custom mix-and-match dry sweet boxes, authentic Mishti Doi, Rasmalai, Chom Chom, Kalo Jam, Sandesh, party trays, and traditional winter pitha.",
  keywords: [
    "Bengali Mithai",
    "Bangladeshi Mishti",
    "Mishti Doi",
    "Rasmalai Cake",
    "Premium Indian Sweets",
    "Desi Sweets Houston",
    "Halal Sweets USA",
    "Custom Sweet Boxes",
    "Traditional Pitha",
    "Chom Chom",
    "Kalo Jam",
    "Gulab Jamun",
    "Sandesh",
    "Rasgulla",
    "Bangladeshi Mithai Online",
    "Bengali Desserts"
  ],
  openGraph: {
    title: "Murad Sweets | Authentic Bangladeshi Mishti & Bengali Mithai",
    description: "Premium, authentic home-cooked Bangladeshi sweets in Houston. Specializing in mix-and-match boxes, Mishti Doi, Rasmalai, and traditional pitha.",
    url: "https://muradsweets.com",
    siteName: "Murad Sweets",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Murad Sweets | Premium Bangladeshi Mishti & Bengali Mithai",
    description: "Authentic, handcrafted Bangladeshi sweets. Order custom mix-and-match boxes, Mishti Doi, and more today.",
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
        {/* Fulfillment system */}
        <FulfillmentGuard />
        <FulfillmentModal />
      </body>
    </html>
  );
}
