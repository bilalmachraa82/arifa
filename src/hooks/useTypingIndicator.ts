import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface TypingUser {
  id: string;
  name: string;
}

export function useTypingIndicator(conversationId: string) {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (!user || !conversationId) return;

    const channel = supabase.channel(`typing:${conversationId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const users: TypingUser[] = [];
        
        Object.entries(state).forEach(([userId, presences]) => {
          if (userId !== user.id) {
            const presence = presences[0] as { name?: string; isTyping?: boolean };
            if (presence?.isTyping) {
              users.push({
                id: userId,
                name: presence.name || "Utilizador",
              });
            }
          }
        });
        
        setTypingUsers(users);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Utilizador",
            isTyping: false,
          });
        }
      });

    channelRef.current = channel;

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [user, conversationId]);

  const startTyping = useCallback(async () => {
    if (!user || !channelRef.current || isTypingRef.current) return;
    
    isTypingRef.current = true;
    
    await channelRef.current.track({
      name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Utilizador",
      isTyping: true,
    });
  }, [user]);

  const stopTyping = useCallback(async () => {
    if (!user || !channelRef.current || !isTypingRef.current) return;
    
    isTypingRef.current = false;
    
    await channelRef.current.track({
      name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Utilizador",
      isTyping: false,
    });
  }, [user]);

  const handleInputChange = useCallback(() => {
    startTyping();
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  }, [startTyping, stopTyping]);

  return {
    typingUsers,
    handleInputChange,
    stopTyping,
  };
}
