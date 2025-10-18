import type { Metadata } from "next";
import "./globals.css";
import { Urbanist } from "next/font/google"
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from '@/lib/mock-clerk'
import TopLoader from "@/components/shared/TopLoader";

const font = Urbanist({ 
  subsets: ['latin'], 
  weight: ['500']
});

export const metadata: Metadata = {
  title: "Air Transport Pilot School",
  description: "Air Transport Pilot School",
  icons: {
    icon: "/atps-default.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${font.className} antialiased`}
        >
          <Toaster />
          <TopLoader/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
