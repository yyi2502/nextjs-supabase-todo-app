import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { createClient } from "@/utils/supabase/server";
import ToastProvider from "@/components/providers/ToastProvider";

export const metadata: Metadata = {
  title: "TODOアプリ",
  description: "nextjs + supabase",
};

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  return (
    <html lang="ja">
      <body>
        <ToastProvider />
        <div className="flex min-h-screen flex-col">
          <Header user={user} />
          <main className="container max-w-2xl mx-auto px-5 flex-1 mt-10 mb-12">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
