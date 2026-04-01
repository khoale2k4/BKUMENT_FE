import ModalNotification from "@/components/ui/ModalNotification";
import "./globals.css";
import StoreProvider from "./providers/StoreProvider";
import GlobalToast from "@/components/ui/ToastNotification";
import { MantineProvider } from "@mantine/core";
import ReportModal from "@/components/ui/ReportModal";
import I18nProvider from "./providers/I18nProvider";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <I18nProvider>
          <StoreProvider>
          <MantineProvider>{children}</MantineProvider>
          <ModalNotification />
          <GlobalToast />                
          <ConfirmationModal />
          <ReportModal />
        </StoreProvider>

        </I18nProvider>
        
      </body>
    </html>
  );
}