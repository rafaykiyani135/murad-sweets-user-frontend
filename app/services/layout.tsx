import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Catering & Event Services | Bangladeshi Mishti | Murad Sweets",
  description: "Elevate your events with our authentic Bengali Desserts and Bangladeshi Mishti. Perfect for weddings, engagements, and corporate events with luxury dessert tables and custom sweet boxes.",
  keywords: [
    "Mishti Catering",
    "Bengali Wedding Sweets",
    "Bangladeshi Wedding Desserts",
    "Bengali Dessert Table",
    "Custom Mishti Boxes",
    "Event Catering Houston"
  ]
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
