import { Link, useRouterState } from "@tanstack/react-router";
import { Leaf, LogOut } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function SiteNav() {
  const { session } = useSession();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onDark = true; // always dark theme

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl btn-hero">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Opti<span className="gradient-text">Crop</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="/#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="/#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="/#about" className="transition-colors hover:text-foreground">
            About
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/predict">Dashboard</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/";
                }}
              >
                <LogOut className="mr-1.5 h-4 w-4" /> Sign out
              </Button>
            </>
          ) : (
            <>
              {pathname !== "/auth" && (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/auth">Sign in</Link>
                </Button>
              )}
              <Button asChild size="sm" className="btn-hero hover:btn-hero-hover">
                <Link to="/predict">
                  {onDark ? "Try OptiCrop" : "Get started"}
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
