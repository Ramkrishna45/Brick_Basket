import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-paper text-ink">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
