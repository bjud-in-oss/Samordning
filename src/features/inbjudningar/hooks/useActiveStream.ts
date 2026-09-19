// [src/features/inbjudningar/hooks/useActiveStream.ts] - Active Stream Hook

import { useState, useEffect, useMemo, useCallback } from "react";
import { ActiveAlert } from "../../mission_router";
import { subscribeToFirestoreAlerts } from "../../../main/config/firebaseClient";
import { SavedFilterTags } from "../components/StreamFilterStatus";

export function useActiveStream(savedTags?: SavedFilterTags | null) {
  const [stream, setStream] = useState<ActiveAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStream = useCallback(async (silent: boolean = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);
      const res = await fetch("/api/alerts");
      if (!res.ok) throw new Error("Gick inte att läsa in aktiva anslag.");
      const data = await res.json();
      setStream(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      if (!silent) {
        setError(err instanceof Error ? err.message : "Tekniskt fel vid inläsning.");
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let hasData = false;
    const unsub = subscribeToFirestoreAlerts((items) => {
      if (Array.isArray(items) && items.length > 0) {
        hasData = true;
        setStream(items);
        setLoading(false);
      }
    });
    const fallback = setTimeout(() => { if (!hasData) fetchStream(false); }, 1000);
    const interval = setInterval(() => { if (!hasData) fetchStream(true); }, 15000);
    return () => { unsub(); clearTimeout(fallback); clearInterval(interval); };
  }, [fetchStream]);

  const pendingAlerts = useMemo(() => stream.filter((i) => i.status === "pending"), [stream]);
  const activeStream = useMemo(() => stream.filter((i) => i.status !== "pending" && i.status !== "rejected"), [stream]);

  const filteredStream = useMemo(() => {
    return activeStream.filter((item) => {
      if (!savedTags) return true;
      if (savedTags.limitAreas && savedTags.limitedAreas?.length && item.area && !savedTags.limitedAreas.includes(item.area)) return false;
      if (savedTags.enabledCategories?.length && item.category && !savedTags.enabledCategories.includes(item.category)) return false;
      if (savedTags.organizations?.length && item.responsibleParty && !savedTags.organizations.includes(item.responsibleParty)) return false;
      if (savedTags.languages?.length && item.language && !savedTags.languages.includes(item.language)) return false;
      return true;
    });
  }, [activeStream, savedTags]);

  const handleModerate = async (id: string, newStatus: "active" | "rejected") => {
    try {
      const res = await fetch(`/api/alerts/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchStream();
    } catch (err) {
      console.error("Modereringsfel:", err);
    }
  };

  return {
    stream,
    loading,
    error,
    pendingAlerts,
    activeStream,
    filteredStream,
    fetchStream,
    handleModerate
  };
}
