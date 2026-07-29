import { useState } from "react";
import { subscribeUserToPush } from "../features/mobile_pwa_app";
import { UiLanguage } from "../features/mission_router";

export function usePushNotifications(
  uiLanguage: UiLanguage | null,
  subscriptionId: string | null,
  setSubscriptionId: (id: string | null) => void,
  savedTags: any,
  onShowIosModal: () => void
) {
  const [pushEnabled, setPushEnabled] = useState<boolean>(false);
  const [pushError, setPushError] = useState<string | null>(null);

  const handleEnablePush = async () => {
    setPushError(null);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in navigator && (navigator as any).standalone === true);
    if (isIOS && !isStandalone) {
      onShowIosModal();
      return;
    }

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setPushError(uiLanguage === "sv" ? "Din enhet stöder tyvärr inte Web Push-aviseringar." : "Unfortunately, your device does not support Web Push notifications.");
      return;
    }

    try {
      const keyRes = await fetch("/api/vapid-public-key");
      if (!keyRes.ok) throw new Error(uiLanguage === "sv" ? "Misslyckades att hämta anslutningsnyckel från servern." : "Failed to fetch public key from the server.");
      
      const contentType = keyRes.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
          throw new Error(uiLanguage === "sv" ? "Kritiskt fel: Servern saknar API." : "Critical error: Server lacks API.");
      }

      const { publicKey } = await keyRes.json();

      if (!publicKey) {
        throw new Error(uiLanguage === "sv" ? "Ingen giltig anslutningsnyckel returnerades från servern." : "No valid public key was returned from the server.");
      }

      const subscription = await subscribeUserToPush(publicKey, "/sw.js");

      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: subscriptionId,
          subscription,
          tags: savedTags || {
            areas: [],
            languages: [],
            organization: "",
            formats: ["physical", "telephone"],
            alwaysNotify: true,
            spiritualTips: true
          }
        })
      });

      if (!response.ok) throw new Error(uiLanguage === "sv" ? "Kunde inte slutföra registreringen på servern." : "Could not complete registration on the server.");
      const data = await response.json();

      localStorage.setItem("mission_router_sub_id", data.id);
      setSubscriptionId(data.id);
      setPushEnabled(true);
    } catch (err: any) {
      console.error("Failed to enable push", err);
      setPushError(err.message || String(err));
    }
  };

  const handleDisablePush = async () => {
    try {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          try {
            const subscription = await reg.pushManager.getSubscription();
            if (subscription) {
              await subscription.unsubscribe();
            }
          } catch (subErr) {
            console.error("Failed to unsubscribe subscription", subErr);
          }
          try {
            await reg.unregister();
          } catch (unregErr) {
            console.error("Failed to unregister sw", unregErr);
          }
        }
      }
      localStorage.removeItem("mission_router_sub_id");
      setSubscriptionId(null);
      setPushEnabled(false);
    } catch (err) {
      console.error("Failed to disable push", err);
    }
  };

  return {
    pushEnabled,
    setPushEnabled,
    pushError,
    handleEnablePush,
    handleDisablePush
  };
}
