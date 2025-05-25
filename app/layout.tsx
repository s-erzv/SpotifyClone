import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from 'next/font/google';
import Sidebar from "@/components/Sidebar";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import Player from "@/components/Player";
import getActiveProductWithPrices from "@/actions/getActiveProductWithPrices";

const font = Figtree({
  subsets: ["latin"],
    weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "A Spotify clone built with Next.js and Tailwind CSS",
};

export const revalidate = 0; 

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const products = await getActiveProductWithPrices();


  return (
    <html lang="en">
      <body
        className={`${font.className} antialiased`}
      >
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider products={products}/>
            <Sidebar>
              {children}
            </Sidebar>
            <Player />
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
