import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import ConciergeButton from "@/components/ConciergeButton";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ConciergeButton />
    </div>
  );
}
