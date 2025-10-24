import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const montserrat = Inter({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CampaignHub - Campaign Management Platform",
  description:
    "Manage marketing campaigns with real-time call tracking and analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={montserrat.className}>
        <body className={`font-sans antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
