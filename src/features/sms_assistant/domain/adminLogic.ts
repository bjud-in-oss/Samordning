// [src/features/sms_assistant/domain/adminLogic.ts] - Admin and Trusted Creator Logic Helpers

export function normalizePhone(num: string): string {
  if (!num) return "";
  let cleaned = num.replace(/\s+/g, "").replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+46")) return "0" + cleaned.substring(3);
  if (cleaned.startsWith("0046")) return "0" + cleaned.substring(4);
  return cleaned;
}

export function isValidPhone(phone: string): boolean {
  const norm = normalizePhone(phone);
  return /^0\d{8,11}$/.test(norm);
}

export function isPhoneInList(list: string[], phone: string): boolean {
  const target = normalizePhone(phone);
  if (!target) return false;
  return list.some(item => normalizePhone(item) === target);
}

export function addPhoneToList(list: string[], phone: string): string[] {
  const norm = normalizePhone(phone);
  if (!norm || !isValidPhone(norm) || isPhoneInList(list, norm)) {
    return list;
  }
  return [...list, norm];
}

export function removePhoneFromList(list: string[], phone: string): string[] {
  const target = normalizePhone(phone);
  if (!target) return list;
  return list.filter(item => normalizePhone(item) !== target);
}

export function filterPendingAlerts<T extends { status?: string }>(alerts: T[]): T[] {
  return alerts.filter(a => a.status === "pending" || a.status === "pending_review");
}

export type LogLevel = "ALLA" | "INFO" | "WARN" | "ERROR";

export interface LogEntry {
  isUser?: boolean;
  text: string;
  level?: "INFO" | "WARN" | "ERROR";
  timestamp?: string;
}

export function classifyLogLevel(entry: LogEntry): "INFO" | "WARN" | "ERROR" {
  if (entry.level) return entry.level;
  const txt = (entry.text || "").toLowerCase();
  if (txt.includes("varning") || txt.includes("warn") || txt.includes("obehörig") || txt.includes("tips")) {
    return "WARN";
  }
  if (
    txt.includes("fel") || 
    txt.includes("error") || 
    txt.includes("ogiltig") || 
    txt.includes("misslyckas") || 
    txt.includes("403") || 
    txt.includes("404") || 
    txt.includes("500")
  ) {
    return "ERROR";
  }
  return "INFO";
}

export function filterLogs(
  logs: LogEntry[], 
  searchQuery: string, 
  levelFilter: LogLevel
): LogEntry[] {
  const query = searchQuery.trim().toLowerCase();
  return logs.filter(log => {
    const level = classifyLogLevel(log);
    if (levelFilter !== "ALLA" && level !== levelFilter) {
      return false;
    }
    if (!query) return true;
    const textMatch = log.text.toLowerCase().includes(query);
    const timeMatch = log.timestamp ? log.timestamp.toLowerCase().includes(query) : false;
    return textMatch || timeMatch;
  });
}
