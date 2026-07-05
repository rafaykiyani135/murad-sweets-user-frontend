import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Murad Sweets Admin",
  description: "Set a new password for your Murad Sweets admin account.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
