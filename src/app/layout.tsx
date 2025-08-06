import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
