import React, { useState, useEffect } from "react";
import { Send, Smartphone, ShieldCheck } from "lucide-react";

export default function AdminConsole() {
  const [apiSecret, setApiSecret] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    setApiSecret(localStorage.getItem("admin_api_secret") || "");
    setPhoneNumber(localStorage.getItem("admin_phone_number") || "");
  }, []);

  const sendSms = async () => {
    if (!apiSecret || !phoneNumber) return;
    localStorage.setItem("admin_api_secret", apiSecret);
    localStorage.setItem("admin_phone_number", phoneNumber);

    const res = await fetch("/api/incoming-sms", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-api-secret": apiSecret 
      },
      body: JSON.stringify({ sender: phoneNumber, text: message })
    });
    
    const data = await res.json();
    setLogs(prev => [`${phoneNumber}: ${message}`, `Gemma: ${data.replyMessage || JSON.stringify(data)}`, ...prev]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-900">
      <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ShieldCheck className="text-teal-600" /> Admin SMS Konsol
      </h1>
      
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4 space-y-3">
        <input className="w-full p-2 border rounded" placeholder="API Secret" value={apiSecret} onChange={e => setApiSecret(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Telefonnummer" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
      </div>

      <div className="flex gap-2 mb-4">
        <input className="flex-1 p-2 border rounded" placeholder="SMS..." value={message} onChange={e => setMessage(e.target.value)} />
        <button onClick={sendSms} className="bg-slate-900 text-white p-2 rounded"><Send size={20} /></button>
      </div>

      <div className="space-y-2">
        {logs.map((log, i) => <div key={i} className="text-xs font-mono bg-white p-2 border rounded">{log}</div>)}
      </div>
    </div>
  );
}
