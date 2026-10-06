import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MetaPixel } from "@/components/analytics/MetaPixel";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://loomsday.store"),
  title: "LOOMSDAY | Quiet Luxury Bedding & Elevated Rest",
  description:
    "Woven from slow-harvested 100% certified organic French flax and Aegean cotton. Pre-washed with volcanic stones for impossibly soft rest from night one.",
  keywords: [
    "luxury bedding",
    "French flax linen",
    "organic cotton sheets",
    "goose down duvet",
    "LOOMSDAY",
    "quiet luxury",
    "sleep sanctuary",
  ],
  alternates: {
    canonical: "https://loomsday.store",
  },
  openGraph: {
    title: "LOOMSDAY | Quiet Luxury Bedding & Elevated Rest",
    description:
      "Woven in Northern France from 100% certified organic flax. Impossibly soft from night one, tailored for a lifetime of quiet rest.",
    url: "https://loomsday.store",
    siteName: "LOOMSDAY",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <ToastProvider>
            <MetaPixel />
            <Header />
            <main className="w-full pt-28 bg-surface flex-1 flex flex-col">
              {children}
            </main>
            <CartDrawer />
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
