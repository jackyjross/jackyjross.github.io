import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteLayout from "@/components/layout/SiteLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jack Ross - Photographer & Growth Professional",
  description: "Based in Chicago, Illinois. Street photography documenting urban landscapes and human stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
