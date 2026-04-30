import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { PaymentPlanProvider } from '@/context/PaymentPlanContext';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <AuthProvider>
          <ThemeProvider>
            <PaymentPlanProvider>
              <NotificationProvider>
                <SidebarProvider>{children}</SidebarProvider>
              </NotificationProvider>
            </PaymentPlanProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
