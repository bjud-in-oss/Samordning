import { useState } from "react";
import { UiLanguage } from "../features/mission_router";

export function useAppState() {
  const [showIosModal, setShowIosModal] = useState<boolean>(false);
  
  const [uiLanguage, setUiLanguage] = useState<UiLanguage | null>(() => {
    try {
      const stored = localStorage.getItem("mission_router_ui_language") as UiLanguage | null;
      if (stored && ["sv", "en", "es", "sw", "vi"].includes(stored)) {
        return stored;
      }
    } catch (e) {
      // Ignore
    }
    return null;
  });

  const [hasAcceptedIntro, setHasAcceptedIntro] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mission_router_has_accepted_intro") === "true";
    } catch (e) {
      return false;
    }
  });
  
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem("isAdmin") === "true";
    } catch (e) {
      return false;
    }
  });

  const setAdminStatus = (status: boolean) => {
    try {
      if (status) {
        localStorage.setItem("isAdmin", "true");
      } else {
        localStorage.removeItem("isAdmin");
      }
    } catch (e) {
      // Ignore
    }
    setIsAdmin(status);
  };

  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);

  const [subscriptionId, setSubscriptionId] = useState<string | null>(() => {
    try {
      return localStorage.getItem("mission_router_sub_id");
    } catch (e) {
      return null;
    }
  });

  const [savedTags, setSavedTags] = useState<any>(() => {
    try {
      const data = localStorage.getItem("mission_router_tags");
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn("Could not parse mission_router_tags from localStorage", e);
      return null;
    }
  });

  return {
    showIosModal,
    setShowIosModal,
    uiLanguage,
    setUiLanguage,
    hasAcceptedIntro,
    setHasAcceptedIntro,
    isAdmin,
    setIsAdmin,
    setAdminStatus,
    activeAlertId,
    setActiveAlertId,
    subscriptionId,
    setSubscriptionId,
    savedTags,
    setSavedTags,
  };
}
