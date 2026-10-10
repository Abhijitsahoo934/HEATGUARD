import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HEATGUARD | Industrial Heat Safety Command Center",
  description: "Industrial facility heat monitoring and local protection readiness.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}