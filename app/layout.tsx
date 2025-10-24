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
  title: "RingoAI - AI-powered customer support",
  description:
    "Manage customer support with AI-powered chatbots and AI-assisted agents",
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
