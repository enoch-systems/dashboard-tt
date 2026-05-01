import { Outfit } from 'next/font/google';
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    default: "TT Academy Portal",
    template: "%s | TT Academy",
  },
  description: "Tech Trailblazer Academy student portal and admin workspace.",
  icons: {
    icon: [
      {
        url: "https://res.cloudinary.com/deafv5ovi/image/upload/v1777616551/Palantir_raises_annual_revenue_forecast_on_booming_AI_demand_fmzl1s.jpg?v=2",
        type: "image/jpeg",
      },
    ],
    shortcut: [
      "https://res.cloudinary.com/deafv5ovi/image/upload/v1777616551/Palantir_raises_annual_revenue_forecast_on_booming_AI_demand_fmzl1s.jpg?v=2",
    ],
    apple: [
      "https://res.cloudinary.com/deafv5ovi/image/upload/v1777616551/Palantir_raises_annual_revenue_forecast_on_booming_AI_demand_fmzl1s.jpg?v=2",
    ],
  },
};

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
