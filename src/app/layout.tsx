import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Study Group Finder - TU/e",
    description: "Find and create study sessions wtih fellow TU/e students",
};

export default function RootLayout ({
    children,
}: {
    children: React.ReactNode;
}) {
   return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}