import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import GlobalCartWrapper from "@/components/GlobalCartWrapper";

export const metadata: Metadata = {
  title: "Mount Pleasant Fish and Chips - Perth, Australia",
  description: "Authentic fish and chips in Mount Pleasant, Perth. Fresh fish, crispy chips, and traditional Australian seafood since 1985.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <GlobalCartWrapper>
            {children}
          </GlobalCartWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
