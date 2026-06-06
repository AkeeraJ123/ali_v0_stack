import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "BaddieFactory AI — Create Your AI Influencer",
  description:
    "The luxury AI creator studio for building realistic, identity-consistent AI influencer models.",
  keywords: ["AI influencer", "AI model", "content creator", "BaddieFactory"],
  openGraph: {
    title: "BaddieFactory AI",
    description: "Create stunning AI influencer models with identity consistency",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0a0a0a] text-white min-h-screen">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(20, 0, 12, 0.95)",
              color: "#fff",
              border: "1px solid rgba(255,0,128,0.3)",
              backdropFilter: "blur(12px)",
            },
            success: {
              iconTheme: {
                primary: "#FF0080",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
