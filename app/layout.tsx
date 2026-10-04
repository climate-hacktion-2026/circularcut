import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CircularCut — EarthSync",
  description: "Match workshop orders with timber offcuts, inspect cutting plans and record reuse.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
