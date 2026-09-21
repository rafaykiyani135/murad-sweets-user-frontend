import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us | Murad Sweets | Authentic Bangladeshi Mishti",
  description: "Get in touch with Murad Sweets in Houston. Inquire about ordering our authentic Bengali Desserts, Mishti Doi, Rasmalai, and traditional Pitha for your next occasion.",
  keywords: [
    "Contact Murad Sweets",
    "Order Bangladeshi Mishti",
    "Buy Bengali Desserts Houston",
    "Mishti Shop Houston",
    "Dessert Delivery"
  ]
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
