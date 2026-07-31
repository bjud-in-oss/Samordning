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
