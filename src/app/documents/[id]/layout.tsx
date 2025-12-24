import "../../globals.css";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
                <div className="w-full flex-1 container mx-auto max-w-7xl">
                    {children}
                </div>
            <Footer />
        </div>
    );
}