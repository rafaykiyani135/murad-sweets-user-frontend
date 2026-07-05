import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Murad Sweets Admin",
  description: "Sign in to the Murad Sweets admin dashboard.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
