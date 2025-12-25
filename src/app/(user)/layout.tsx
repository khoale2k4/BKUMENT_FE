import Sidebar from "@/components/layouts/Sidebar";
import "../globals.css";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
