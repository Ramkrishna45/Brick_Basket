import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ComingSoonProvider } from "@/components/ui/ComingSoonModal";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ComingSoonProvider>
      <div className="flex flex-col min-h-screen bg-paper text-ink">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ComingSoonProvider>
  );
}
