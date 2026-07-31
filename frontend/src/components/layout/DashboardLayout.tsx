import type { ReactNode } from "react";
import { TopNavbar } from "./TopNavbar";
import { Footer } from "./Footer";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <TopNavbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
