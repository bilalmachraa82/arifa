import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function usePushNotifications() {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if push notifications are supported
    const supported = "serviceWorker" in navigator && "PushManager" in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const checkSubscription = useCallback(async () => {
    if (!user || !isSupported) {
      setLoading(false);
      return;
    }

    try {
      // Check if user has a subscription in the database
      const { data, error } = await supabase
        .from("push_subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setIsSubscribed(!!data);
    } catch (error) {
      console.error("Error checking push subscription:", error);
    } finally {
      setLoading(false);
    }
  }, [user, isSupported]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  const subscribe = async (vapidPublicKey: string) => {
    if (!user || !isSupported) return { success: false, error: "Not supported" };

    try {
      setLoading(true);

      // Request permission
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission !== "granted") {
        return { success: false, error: "Permission denied" };
      }

      // Register service worker if not already
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      const subscriptionJson = subscription.toJSON();

      // Save to database
      const { error } = await supabase.from("push_subscriptions").insert({
        user_id: user.id,
        endpoint: subscription.endpoint,
        p256dh: subscriptionJson.keys?.p256dh || "",
        auth: subscriptionJson.keys?.auth || "",
      });

      if (error) throw error;

      setIsSubscribed(true);
      return { success: true };
    } catch (error: any) {
      console.error("Error subscribing to push:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    if (!user) return { success: false, error: "Not authenticated" };

    try {
      setLoading(true);

      // Remove from database
      const { error } = await supabase
        .from("push_subscriptions")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      // Unsubscribe from push manager
      if (isSupported) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
      }

      setIsSubscribed(false);
      return { success: true };
    } catch (error: any) {
      console.error("Error unsubscribing from push:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    isSupported,
    isSubscribed,
    permission,
    loading,
    subscribe,
    unsubscribe,
    refresh: checkSubscription,
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}
