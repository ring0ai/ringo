"use client"

import { UserButton } from "@clerk/nextjs"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-lg text-foreground hover:text-primary transition-colors">
          Campaign Manager
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard/clients"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Clients
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}
