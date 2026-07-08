import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us | Murad Sweets | Authentic Bangladeshi Mishti",
  description: "Get in touch with Murad Sweets in Houston. Inquire about ordering our authentic Bengali Mithai, Mishti Doi, Rasmalai, and traditional Pitha for your next occasion.",
  keywords: [
    "Contact Murad Sweets",
    "Order Bangladeshi Mishti",
    "Buy Bengali Mithai Houston",
    "Mishti Shop Houston",
    "Mithai Delivery"
  ]
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
