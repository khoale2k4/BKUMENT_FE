import Sidebar from "@/components/layouts/Sidebar";
import '@mantine/core/styles.css';
import "../globals.css";
import Header from "@/components/layouts/Header/Header";
import Footer from "@/components/layouts/Footer";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <div className="flex flex-1 container max-w-[1600px] md:px-6 w-full my-6">
                <Sidebar />
                <main className="flex-1 min-w-0 transition-all duration-300">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}