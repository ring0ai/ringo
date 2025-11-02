"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import MasterLayout from "@/components/layout/MasterLayout";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      router.push("/dashboard");
    }
  }, [isLoaded, user, router]);

  return (
    <>
      <MasterLayout>
        <div>bhau bhau</div>
      </MasterLayout>
    </>
  );
}
