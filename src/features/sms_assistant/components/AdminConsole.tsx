// [src/features/sms_assistant/components/AdminConsole.tsx] - Admin SMS Console Component

import React, { useState, useEffect } from "react";
import { Send, RefreshCw } from "lucide-react";
import { PairingGate } from "./PairingGate";
import { PendingAlertsQueue } from "./PendingAlertsQueue";
import { AdminLogsArea } from "./AdminLogsArea";
import { AdminConsoleHeader } from "./AdminConsoleHeader";

export default function AdminConsole() {
  const [deviceToken, setDeviceToken] = useState("");
  const [isPaired, setIsPaired] = useState(false);
  const [checkingPairing, setCheckingPairing] = useState(true);
  const [apiSecret, setApiSecret] = useState("samordning-secret-2026");
  const [phoneNumber, setPhoneNumber] = useState("0700000000");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<{isUser: boolean, text: string}[]>([]);
  const [pendingAlerts, setPendingAlerts] = useState<any[]>([]);

  const fetchPending = async () => {
    try {
      const res = await fetch("/api/alerts");
      if (res.ok) {
        const data = await res.json();
        const pending = data.filter((a: any) => a.status === "pending" || a.status === "pending_review");
        setPendingAlerts(pending);
      }
    } catch (e) {
      console.error("Fel vid hämtning av väntande förslag", e);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/alerts/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" })
      });
      if (res.ok) {
        fetchPending();
      }
    } catch (e) {
      alert("Kunde inte godkänna förslaget.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/alerts/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" })
      });
      if (res.ok) {
        fetchPending();
      }
    } catch (e) {
      alert("Kunde inte avböja förslaget.");
    }
  };

  useEffect(() => {
    let token = localStorage.getItem("admin_device_token");
    if (!token) {
      token = "dev_tok_" + Math.random().toString(36).substring(2, 11);
      localStorage.setItem("admin_device_token", token);
    }
    setDeviceToken(token);

    const savedSecret = localStorage.getItem("admin_api_secret");
    if (savedSecret) setApiSecret(savedSecret);

    const savedPhone = localStorage.getItem("admin_phone_number");
    if (savedPhone) setPhoneNumber(savedPhone);

    checkPairingStatus(token);
  }, []);

  const checkPairingStatus = async (token: string) => {
    setCheckingPairing(true);
    try {
      const res = await fetch(`/api/admin/check-pairing?token=${encodeURIComponent(token)}`);
      const data = await res.json();
      if (data.paired) {
        setIsPaired(true);
      } else {
        setIsPaired(false);
      }
    } catch (e) {
      console.error("Fel vid kontroll av parning:", e);
      setIsPaired(false);
    } finally {
      setCheckingPairing(false);
    }
  };

  const handleDirectLoopbackPair = async () => {
    if (!deviceToken) return;
    try {
      const res = await fetch("/api/admin/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: deviceToken })
      });
      const data = await res.json();
      if (data.success) {
        setIsPaired(true);
      }
    } catch (e) {
      alert("Kunde inte aktivera enheten direkt.");
    }
  };

  const sendSms = async (customText?: string) => {
    const textToSend = customText || message.trim();
    if (!apiSecret || !phoneNumber || !textToSend) return;
    
    localStorage.setItem("admin_api_secret", apiSecret);
    localStorage.setItem("admin_phone_number", phoneNumber);

    setLogs(prev => [{ isUser: true, text: textToSend }, ...prev]);
    if (!customText) setMessage("");

    try {
      const res = await fetch("/api/incoming-sms", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-secret": apiSecret 
        },
        body: JSON.stringify({ sender: phoneNumber, text: textToSend })
      });
      
      const data = await res.json();
      setLogs(prev => [{ isUser: false, text: data.replyMessage || JSON.stringify(data) }, ...prev]);
    } catch (e: any) {
      setLogs(prev => [{ isUser: false, text: "Nätverksfel eller ogiltigt svar." }, ...prev]);
    }
  };

  const insertTemplate = () => {
    setMessage("Tid: Idag kl 18:00\nMötesplats: Kortedala Torg\nAktivitet: Gemensam fika och samtal om tro\nBjud in från områden: Kortedala\nMålgrupp: Alla");
  };

  const gatewayNumber = "0736108997";
  const pairSmsPayload = `#PAIR ${deviceToken}`;
  const smsHref = `sms:${gatewayNumber}?body=${encodeURIComponent(pairSmsPayload)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(smsHref)}`;

  if (checkingPairing) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center bg-[#F0F2F5] font-sans text-brand-ink p-4">
        <div className="flex items-center gap-3 bg-white p-6 rounded-2xl shadow-xs border border-brand-ink/10">
          <RefreshCw className="animate-spin text-brand-accent" size={20} />
          <span className="font-mono text-xs uppercase tracking-wider">Verifierar enhetsparning...</span>
        </div>
      </div>
    );
  }

  if (!isPaired) {
    return (
      <PairingGate
        deviceToken={deviceToken}
        smsHref={smsHref}
        qrUrl={qrUrl}
        onDirectLoopbackPair={handleDirectLoopbackPair}
        onCheckPairingStatus={() => checkPairingStatus(deviceToken)}
      />
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-[#F0F2F5] font-sans text-brand-ink">
      <AdminConsoleHeader onSendSms={sendSms} onInsertTemplate={insertTemplate} />

      <div className="bg-white px-4 py-2.5 border-b border-brand-ink/5 shrink-0 z-10 shadow-xs flex gap-3 text-xs">
         <input 
            type="password"
            className="w-1/2 p-2 bg-brand-bg rounded-lg border border-brand-ink/10 focus:border-brand-accent focus:outline-none transition-colors font-mono text-xs" 
            placeholder="API Secret (t.ex. samordning-secret-2026)" 
            value={apiSecret} 
            onChange={e => setApiSecret(e.target.value)} 
          />
          <input 
            type="text"
            className="w-1/2 p-2 bg-brand-bg rounded-lg border border-brand-ink/10 focus:border-brand-accent focus:outline-none transition-colors font-mono text-xs" 
            placeholder="Ditt nummer (+46...)" 
            value={phoneNumber} 
            onChange={e => setPhoneNumber(e.target.value)} 
          />
      </div>

      <PendingAlertsQueue
        pendingAlerts={pendingAlerts}
        onFetchPending={fetchPending}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <AdminLogsArea logs={logs} phoneNumber={phoneNumber} />

      <div className="bg-[#F0F2F5] p-3 shrink-0 flex gap-2">
        <textarea 
          rows={2}
          className="flex-1 p-3 bg-white rounded-2xl border-none focus:ring-0 shadow-xs resize-none text-xs font-mono leading-relaxed" 
          placeholder="Skriv simulerat SMS..." 
          value={message} 
          onChange={e => setMessage(e.target.value)} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendSms();
            }
          }}
        />
        <button 
          onClick={() => sendSms()} 
          disabled={!apiSecret || !phoneNumber || !message.trim()}
          className="w-11 h-11 bg-brand-accent text-white rounded-full flex items-center justify-center shrink-0 shadow-xs hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed self-end cursor-pointer"
        >
          <Send size={18} className="ml-0.5" />
        </button>
      </div>
    </div>
  );
}
