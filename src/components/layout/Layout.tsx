import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import AIChatbot from "@/components/chat/AIChatbot";
import { SkipLink } from "@/components/ui/accessibility";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Enable realtime notifications for messages
  useRealtimeMessages();

  return (
    <div className="min-h-screen flex flex-col">
      <SkipLink targetId="main-content">Saltar para conteúdo principal</SkipLink>
      <Header />
      <main id="main-content" className="flex-1 pt-[73px]" role="main">
        {children}
      </main>
      <Footer />
      
      {/* AI Chatbot - Available on all pages */}
      <AIChatbot context="public" />
    </div>
  );
}
