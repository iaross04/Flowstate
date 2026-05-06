import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flowstate",
  description: "Smart note capture and organization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
