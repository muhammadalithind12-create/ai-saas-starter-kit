import Link from "next/link";
import { PenLine } from "lucide-react";
import { APP_NAME } from "@/lib/app-config";
import { Button } from "@/components/ui/button";

// Minimal public chrome for the Studio — no auth shell, no sidebar.
const NAV = [
  { href: "/studio", label: "Studio" },
  { href: "/studio/blog", label: "Blog Writer" },
  { href: "/studio/social", label: "Social Captions" },
  { href: "/studio/ideas", label: "Idea Engine" },
];

export default function StudioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/studio" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <PenLine className="h-4 w-4" />
            </span>
            <span className="font-display text-[17px] font-bold tracking-tight">
              {APP_NAME}
            </span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV.map((item) => (
              <Button key={item.href} variant="ghost" size="sm" asChild>
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>
          <Button size="sm" asChild>
            <Link href="/signin">Sign in</Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">{children}</main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
          <span>
            {APP_NAME} Studio — free AI content tools, no signup needed.
          </span>
          <Link href="/signin" className="hover:text-foreground">
            Sign in for the full workspace
          </Link>
        </div>
      </footer>
    </div>
  );
}
