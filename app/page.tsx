'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import {
  ArrowRight,
  BarChart3,
  Phone,
  Zap,
  Users,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import MasterLayout from '@/components/layout/MasterLayout';

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      router.push('/dashboard');
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
