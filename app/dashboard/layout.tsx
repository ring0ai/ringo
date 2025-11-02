import MasterLayout from "@/components/layout/MasterLayout";
import type React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <ClerkLoaded>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </ClerkLoaded>
      <Header /> */}
      <MasterLayout>{children}</MasterLayout>
    </>
  );
}
