import type { Metadata } from "next";
import "./globals.css";
import { Urbanist } from "next/font/google"
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from '@clerk/nextjs'
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
    <ClerkProvider
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
        variables: {
          colorPrimary: '#EECE84', 
          colorTextOnPrimaryBackground: 'black',
          fontSize: '1rem',
        },
        elements: {
          formFieldInput: {
            height: "100px",
          }
        }
      }}
    >
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
