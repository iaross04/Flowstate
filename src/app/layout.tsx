import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegistration from "../components/PWARegistration";

export const metadata: Metadata = {
  title: "FlowState",
  description: "Capture and sort ideas instantly.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FlowState",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white antialiased">
        <PWARegistration />
        {children}
      </body>
    </html>
  );
}
