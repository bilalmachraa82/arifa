import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Enable realtime notifications for messages
  useRealtimeMessages();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-[73px]">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
