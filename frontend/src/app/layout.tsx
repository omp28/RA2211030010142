import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ApiStatusProvider } from "@/components/ApiStatusProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Social Media Analytics",
  description: "Analytics microservice for a social media platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApiStatusProvider>{children}</ApiStatusProvider>
      </body>
    </html>
  );
}
