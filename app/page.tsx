"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import {
  ArrowRight,
  BarChart3,
  Phone,
  Zap,
  Users,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      router.push("/dashboard");
    }
  }, [isLoaded, user, router]);

  return (
    <main className="min-h-screen   overflow-hidden bg-background">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight ">
            Ringo<span className="text-primary">AI</span>
          </div>
          <div className="flex items-center gap-4">
            <SignInButton mode="modal">
              <Button variant="ghost" className=" hover:bg-black/5">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-primary text-white hover:bg-primary/90 cursor-pointer">
                Get Started
              </Button>
            </SignUpButton>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-semibold text-primary">
              ✨ Introducing RingoAI
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight text-balance">
            Campaign Management <span className="text-primary">Reimagined</span>
          </h1>

          <p className="text-xl text-foreground/60 max-w-2xl mx-auto text-balance leading-relaxed">
            Track calling campaigns in real-time, manage agent calls, collect
            feedback, and analyze performance with enterprise-grade tools built
            for modern teams.
          </p>

          <div
            className="flex flex-col sm:flex-row sm:items-center gap-4 justify-center pt-4 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <SignUpButton mode="modal">
              <Button size="lg">
                Start Free <ArrowRight className="w-4 h-4" />
              </Button>
            </SignUpButton>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>

          {/* Trust Badges */}
          <div
            className="pt-12 border-t border-black/10 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-foreground/60 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-black/2">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-foreground/60">
              Powerful features designed for campaign management at scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description:
                  "Track campaign performance with live dashboards and detailed metrics",
              },
              {
                icon: Phone,
                title: "Call Management",
                description:
                  "Monitor agent calls, collect feedback, and manage call queues seamlessly",
              },
              {
                icon: TrendingUp,
                title: "Performance Insights",
                description:
                  "Access comprehensive call logs, history, and performance analytics",
              },
              {
                icon: Users,
                title: "Multi-Client Support",
                description:
                  "Manage multiple clients and their campaigns from a single dashboard",
              },
              {
                icon: Zap,
                title: "Instant Notifications",
                description:
                  "Get real-time alerts for important campaign events and milestones",
              },
              {
                icon: CheckCircle,
                title: "Enterprise Security",
                description:
                  "SOC 2 compliant with advanced security and data protection",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-xl border border-black/10 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <Icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/60">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-lg text-foreground/60">
              Get started in minutes, not days
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Create Account",
                description: "Sign up and set up your workspace",
              },
              {
                step: "2",
                title: "Add Clients",
                description: "Invite your clients to the platform",
              },
              {
                step: "3",
                title: "Create Campaigns",
                description: "Set up your calling campaigns",
              },
              {
                step: "4",
                title: "Track & Analyze",
                description: "Monitor calls and collect insights",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-foreground/60 text-sm">
                    {item.description}
                  </p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-6 -right-4 text-primary/30">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-primary text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { number: "500+", label: "Active Campaigns" },
              { number: "100K+", label: "Calls Tracked" },
              { number: "99.9%", label: "Uptime" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <p className="text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Ready to transform your campaigns?
          </h2>
          <p className="text-lg text-foreground/60">
            Join hundreds of teams managing campaigns efficiently with RingoAI
          </p>
          <SignUpButton mode="modal">
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 cursor-pointer gap-2"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Button>
          </SignUpButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-foreground/60">
          <div className="text-2xl font-bold text-foreground mb-4 md:mb-0">
            Campaign<span className="text-primary">Hub</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </main>
  );
}
