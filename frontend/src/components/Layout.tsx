import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {children}
      </main>
      <footer className="border-t bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Marketplace. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
