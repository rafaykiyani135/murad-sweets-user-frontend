import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Menu | Authentic Bangladeshi Mishti & Bengali Mithai | Murad Sweets",
  description: "Browse our complete catalog of authentic Bangladeshi sweets, Bengali Mithai, and Mishti Doi. Order custom mix-and-match dry sweet boxes, Chom Chom, Kalo Jam, Sandesh, and more.",
  keywords: [
    "Bengali Mithai Menu",
    "Bangladeshi Mishti Catalog",
    "Order Mishti Doi",
    "Buy Rasmalai Online",
    "Premium Indian Sweets Menu",
    "Desi Sweets Houston",
    "Halal Sweets USA",
    "Order Chom Chom",
    "Order Kalo Jam",
    "Buy Gulab Jamun",
    "Authentic Sandesh",
    "Rasgulla",
  ]
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
