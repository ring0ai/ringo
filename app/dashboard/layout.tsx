import type React from "react";
import { Header } from "@/components/header";
import { ClerkLoaded, RedirectToSignIn, SignedOut } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClerkLoaded>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </ClerkLoaded>
      <Header />
      {children}
    </>
  );
}
