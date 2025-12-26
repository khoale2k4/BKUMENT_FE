import ModalNotification from "@/components/ui/ModalNotification";
import "./globals.css";
import StoreProvider from "./providers/StoreProvider";
import GlobalToast from "@/components/ui/ToastNotification";
import { MantineProvider } from "@mantine/core";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <StoreProvider>
          <MantineProvider>{children}</MantineProvider>
          <ModalNotification />
          <GlobalToast />
        </StoreProvider>
      </body>
    </html>
  );
}