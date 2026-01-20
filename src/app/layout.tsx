import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LGAIP Dashboard - LG Asset Intelligence Platform",
  description: "AI-powered content automation for LG Electronics global 3P marketplaces",
  icons: {
    icon: "/lg-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}
