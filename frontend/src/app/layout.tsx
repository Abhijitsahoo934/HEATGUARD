import type { Metadata } from "next";
import "../globals.css";

export const metadata = {
  title: "HEATGUARD | Industrial Heat Safety Command Center",
  description: "Industrial facility heat monitoring and local protection readiness.",
} satisfies Metadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 font-sans antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  )
}
