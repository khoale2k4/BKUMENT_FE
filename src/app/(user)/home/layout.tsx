
import Sidebar from "@/components/layouts/Sidebar";
import "../../../app/globals.css";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <div className="flex flex-1 container mx-auto max-w-10xl">
                <Sidebar />
                {children}
            </div>
            <Footer />
        </div>
    );
}