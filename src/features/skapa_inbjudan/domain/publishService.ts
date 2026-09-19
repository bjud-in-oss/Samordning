// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Domain Publish Service

export interface SendSmsPayload {
  from: string;
  body: string;
}

export interface WashAnnouncementResponse {
  result?: {
    hasPrivacyRisk?: boolean;
    hasInappropriateContent?: boolean;
    reason?: string;
  };
}

export async function sendSimulatedSms(body: string, from = "0700000000"): Promise<{ success: boolean; id?: string }> {
  try {
    const response = await fetch("/api/sim/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, body })
    });
    if (response.ok) {
      const data = await response.json();
      return { success: true, id: data.id };
    }
    return { success: false };
  } catch (err) {
    console.error("Publish service error:", err);
    return { success: false };
  }
}

export async function checkAnnouncementContent(formattedText: string): Promise<WashAnnouncementResponse | null> {
  try {
    const response = await fetch("/api/wash-announcement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: formattedText })
    });
    return await response.json();
  } catch (err) {
    console.error("AI Content check error:", err);
    return null;
  }
}
