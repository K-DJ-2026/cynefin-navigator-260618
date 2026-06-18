import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cynefin Navigator",
  description: "Local MVP foundation for workflow-first sense-making."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
