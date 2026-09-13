import { useState, useEffect, useCallback } from "react";
import { AlertItem } from "../domain/schema";

interface UseAdminConsoleOptions {
  onBack?: () => void;
  onPairSuccess?: () => void;
  deviceToken?: string;
}

function parsePendingAlertsFromStorage(): AlertItem[] {
  try {
    const raw = localStorage.getItem("pending_alerts");
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Failed to parse pending alerts from storage:", err);
    return [];
  }
}

function getProcessedAlertsHistory(): AlertItem[] {
  try {
    const raw = localStorage.getItem("active_alerts");
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Failed to parse active alerts from storage:", err);
    return [];
  }
}

function removePendingAlertFromStorage(id: string): void {
  try {
    const raw = localStorage.getItem("pending_alerts");
    if (!raw) return;
    const items: AlertItem[] = JSON.parse(raw);
    const updated = items.filter((a) => a.id !== id);
    localStorage.setItem("pending_alerts", JSON.stringify(updated));
  } catch (err) {
    console.warn("Failed to remove pending alert from storage:", err);
  }
}

export function useAdminConsole({
  onBack,
  onPairSuccess,
  deviceToken: propToken,
}: UseAdminConsoleOptions = {}) {
  const [deviceToken] = useState<string>(() => {
    if (propToken) return propToken;
    let token = localStorage.getItem("admin_device_token");
    if (!token) {
      token = "dev_tok_" + Math.random().toString(36).substring(2, 11);
      localStorage.setItem("admin_device_token", token);
    }
    return token;
  });

  const activeToken = propToken || deviceToken;

  const [isPaired, setIsPaired] = useState<boolean>(() => {
    return localStorage.getItem("isAdmin") === "true";
  });
  const [checkingPairing, setCheckingPairing] = useState<boolean>(true);
  const [pendingAlerts, setPendingAlerts] = useState<AlertItem[]>([]);
  const [activeAlertsList, setActiveAlertsList] = useState<AlertItem[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "members">("pending");

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/alerts");
      if (!res.ok) throw new Error("Failed to fetch alerts");
      const data = await res.json();
      setPendingAlerts(data.pending || []);
      setActiveAlertsList(data.active || []);
    } catch (err) {
      console.warn("Using fallback local alerts:", err);
      setPendingAlerts(parsePendingAlertsFromStorage());
      setActiveAlertsList(getProcessedAlertsHistory());
    }
  }, []);

  const checkPairingStatus = useCallback(
    async (token: string) => {
      if (!token) return;
      try {
        const res = await fetch(`/api/admin/pairing-status?token=${encodeURIComponent(token)}`);
        if (!res.ok) throw new Error("Pairing check error");
        const data = await res.json();
        if (data.paired) {
          setIsPaired(true);
          localStorage.setItem("isAdmin", "true");
          if (onPairSuccess) onPairSuccess();
          fetchAlerts();
        }
      } catch (err) {
        console.warn("Pairing status fallback check:", err);
        if (localStorage.getItem("isAdmin") === "true") {
          fetchAlerts();
        }
      } finally {
        setCheckingPairing(false);
      }
    },
    [onPairSuccess, fetchAlerts]
  );

  useEffect(() => {
    checkPairingStatus(activeToken);
  }, [activeToken, checkPairingStatus]);

  const handleApprove = async (id: string, trustSender?: boolean) => {
    try {
      const res = await fetch("/api/admin/approve-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, trustSender }),
      });
      if (!res.ok) throw new Error("Approve API failed");
      fetchAlerts();
    } catch (err) {
      console.warn("Fallback local approval:", err);
      const alert = pendingAlerts.find((a) => a.id === id);
      removePendingAlertFromStorage(id);
      if (alert) {
        const activeRaw = localStorage.getItem("active_alerts");
        const currentActive: AlertItem[] = activeRaw ? JSON.parse(activeRaw) : [];
        currentActive.unshift({ ...alert, status: "active" });
        localStorage.setItem("active_alerts", JSON.stringify(currentActive));
      }
      fetchAlerts();
    }
  };

  const handleRejectOrDelete = async (id: string, isReject: boolean = true) => {
    try {
      const endpoint = isReject ? "/api/admin/reject-alert" : "/api/admin/delete-alert";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Reject/Delete API failed");
      fetchAlerts();
    } catch (err) {
      console.warn("Fallback local reject/delete:", err);
      if (isReject) {
        removePendingAlertFromStorage(id);
      } else {
        const activeRaw = localStorage.getItem("active_alerts");
        if (activeRaw) {
          const currentActive: AlertItem[] = JSON.parse(activeRaw);
          const updated = currentActive.filter((a) => a.id !== id);
          localStorage.setItem("active_alerts", JSON.stringify(updated));
        }
      }
      fetchAlerts();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("admin_device_token");
    setIsPaired(false);
    if (onBack) onBack();
  };

  return {
    deviceToken: activeToken,
    isPaired,
    checkingPairing,
    pendingAlerts,
    activeAlertsList,
    activeTab,
    setActiveTab,
    checkPairingStatus,
    fetchAlerts,
    handleApprove,
    handleRejectOrDelete,
    handleLogout,
  };
}
