import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useRealtimeMessages() {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    console.log("Setting up realtime subscription for messages");

    const channel = supabase
      .channel("client-messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "client_messages",
        },
        async (payload) => {
          console.log("New message received:", payload);
          
          const newMessage = payload.new as {
            id: string;
            client_id: string;
            sender_id: string;
            subject: string;
            content: string;
          };

          // Only notify if the message is for the current user (as client) and not sent by them
          if (newMessage.client_id === user.id && newMessage.sender_id !== user.id) {
            // Fetch sender info
            const { data: senderProfile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", newMessage.sender_id)
              .single();

            toast({
              title: "Nova mensagem recebida",
              description: `${senderProfile?.full_name || "Admin"}: ${newMessage.subject}`,
            });
          }

          // Notify admin of new client messages
          const { data: isAdmin } = await supabase.rpc("has_role", {
            _user_id: user.id,
            _role: "admin",
          });

          if (isAdmin && newMessage.sender_id !== user.id) {
            const { data: senderProfile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", newMessage.sender_id)
              .single();

            toast({
              title: "Nova mensagem de cliente",
              description: `${senderProfile?.full_name || "Cliente"}: ${newMessage.subject}`,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    return () => {
      console.log("Removing realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [user, toast]);
}
