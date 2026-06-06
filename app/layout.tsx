import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ToastContainer from "@/components/ToastContainer";
import MixMatchModal from "@/components/MixMatchModal";
import CollectionModal from "@/components/CollectionModal";

import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Murad Sweets | Handcrafted Bangladeshi Sweets (Mithai) in USA",
  description: "Experience the premium taste of authentic, home-cooked Bangladeshi sweets. Order custom mix-and-match dry sweet boxes, rasmalai cake, specialty doi, party trays, and traditional winter pitha.",
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
      </body>
    </html>
  );
}
