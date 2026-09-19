// [src/features/sms_assistant/components/AdminMembersPanel.tsx] - Admin & Trusted Members Management

import React, { useState, useEffect } from "react";
import { Users, UserPlus, Shield, Star, Trash2, Lock, Unlock, Key } from "lucide-react";

export function AdminMembersPanel() {
  const [admins, setAdmins] = useState<string[]>([]);
  const [trusted, setTrusted] = useState<string[]>([]);
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "trusted">("trusted");
  const [loading, setLoading] = useState(false);
  const [gatewaySecret, setGatewaySecret] = useState<string>(() => {
    return localStorage.getItem("gateway_secret") || "";
  });
  const [showGatewayPrompt, setShowGatewayPrompt] = useState(false);
  const [inputSecret, setInputSecret] = useState("");

  const hasGateway = Boolean(gatewaySecret.trim());

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/admin/members");
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins || []);
        setTrusted(data.trusted || []);
      }
    } catch (e) {
      console.error("Kunde inte hämta administratörer:", e);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleUnlockGateway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSecret.trim()) return;
    setGatewaySecret(inputSecret.trim());
    localStorage.setItem("gateway_secret", inputSecret.trim());
    setShowGatewayPrompt(false);
    setInputSecret("");
    setNewRole("admin");
  };

  const handleLockGateway = () => {
    setGatewaySecret("");
    localStorage.removeItem("gateway_secret");
    setNewRole("trusted");
  };

  const handleAdd = async () => {
    if (!newPhone.trim()) return;
    if (newRole === "admin" && !hasGateway) {
      setShowGatewayPrompt(true);
      return;
    }

    setLoading(true);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (hasGateway) {
        headers["x-gateway-secret"] = gatewaySecret;
        headers["Authorization"] = `Bearer ${gatewaySecret}`;
      }

      const res = await fetch("/api/admin/members/add", {
        method: "POST",
        headers,
        body: JSON.stringify({ phone: newPhone.trim(), role: newRole, gatewaySecret })
      });
      if (res.ok) {
        setNewPhone("");
        fetchMembers();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Kunde inte lägga till numret.");
      }
    } catch (e) {
      alert("Nätverksfel vid tillägg.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (phone: string, role: "admin" | "trusted") => {
    if (role === "admin" && !hasGateway) {
      setShowGatewayPrompt(true);
      return;
    }

    if (!confirm(`Ta bort ${phone} från ${role === "admin" ? "Samordnare" : "Betrodda Skapare"}?`)) return;
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (hasGateway) {
        headers["x-gateway-secret"] = gatewaySecret;
        headers["Authorization"] = `Bearer ${gatewaySecret}`;
      }

      const res = await fetch("/api/admin/members/remove", {
        method: "POST",
        headers,
        body: JSON.stringify({ phone, role, gatewaySecret })
      });
      if (res.ok) {
        fetchMembers();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Kunde inte ta bort numret.");
      }
    } catch (e) {
      alert("Kunde inte ta bort numret.");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-xs border border-brand-ink/10 space-y-4">
      <div className="flex items-center justify-between border-b border-brand-ink/5 pb-3">
        <div className="flex items-center gap-2">
          <Users className="text-brand-accent shrink-0" size={18} />
          <h3 className="font-semibold text-xs tracking-wider uppercase">Samordnare & Betrodda Skapare</h3>
        </div>
        <div>
          {hasGateway ? (
            <button
              onClick={handleLockGateway}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent border border-brand-accent/30 text-[11px] rounded-lg font-mono transition-colors cursor-pointer"
              title="Lås Gateway-behörighet"
            >
              <Unlock size={12} />
              <span>Gateway aktiv</span>
            </button>
          ) : (
            <button
              onClick={() => setShowGatewayPrompt(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-bg hover:bg-brand-ink/5 text-brand-ink/70 border border-brand-ink/10 text-[11px] rounded-lg font-mono transition-colors cursor-pointer"
              title="Lås upp för att hantera samordnare"
            >
              <Lock size={12} />
              <span>Lås upp Gateway</span>
            </button>
          )}
        </div>
      </div>

      {showGatewayPrompt && (
        <form onSubmit={handleUnlockGateway} className="p-3 bg-brand-bg rounded-xl border border-brand-ink/10 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-brand-ink">
            <Key size={14} className="text-brand-accent" />
            <span>Ange Gateway-nyckel för att hantera Samordnare</span>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Gateway API-secret"
              value={inputSecret}
              onChange={e => setInputSecret(e.target.value)}
              className="flex-1 p-2 bg-white rounded-lg border border-brand-ink/10 font-mono text-xs focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-2 bg-brand-accent text-white rounded-lg font-medium text-xs cursor-pointer hover:opacity-90"
            >
              Lås upp
            </button>
            <button
              type="button"
              onClick={() => setShowGatewayPrompt(false)}
              className="px-3 py-2 bg-white text-brand-ink/70 rounded-lg text-xs border border-brand-ink/10 cursor-pointer"
            >
              Avbryt
            </button>
          </div>
          <p className="text-[11px] text-brand-ink/60">
            Vanliga Samordnare kan enbart redigera Betrodda Skapare. Hantering av Samordnare kräver Gateway-behörighet.
          </p>
        </form>
      )}

      <div className="flex gap-2 text-xs">
        <input
          type="text"
          placeholder="Mobilnummer (t.ex. 0701234567)"
          value={newPhone}
          onChange={e => setNewPhone(e.target.value)}
          className="flex-1 p-2 bg-brand-bg rounded-lg border border-brand-ink/10 font-mono text-xs focus:outline-none"
        />
        <select
          value={newRole}
          onChange={e => {
            const role = e.target.value as "admin" | "trusted";
            if (role === "admin" && !hasGateway) {
              setShowGatewayPrompt(true);
              return;
            }
            setNewRole(role);
          }}
          className="p-2 bg-brand-bg rounded-lg border border-brand-ink/10 text-xs font-mono"
        >
          <option value="trusted">Betrodd Skapare</option>
          <option value="admin" disabled={!hasGateway}>
            {hasGateway ? "Samordnare (Admin)" : "Samordnare (Kräver Gateway)"}
          </option>
        </select>
        <button
          onClick={handleAdd}
          disabled={loading || !newPhone.trim()}
          className="px-3 py-2 bg-brand-accent text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:opacity-90 disabled:opacity-40 cursor-pointer"
        >
          <UserPlus size={14} />
          <span>Lägg till</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
        <div className="bg-brand-bg/50 p-3 rounded-xl border border-brand-ink/5">
          <div className="flex items-center justify-between font-medium text-slate-700 mb-2">
            <div className="flex items-center gap-1.5">
              <Shield size={14} className="text-blue-600" />
              <span>Samordnare ({admins.length})</span>
            </div>
            {!hasGateway && (
              <span className="text-[10px] text-brand-ink/50 font-mono flex items-center gap-1" title="Lås upp Gateway för att redigera">
                <Lock size={10} />
                <span>Skrivskyddad</span>
              </span>
            )}
          </div>
          {admins.length === 0 ? (
            <p className="text-[11px] text-slate-400 italic">Inga samordnare angivna.</p>
          ) : (
            <ul className="space-y-1.5">
              {admins.map(num => (
                <li key={num} className="flex items-center justify-between bg-white p-2 rounded-lg border border-brand-ink/5 font-mono text-[11px]">
                  <span>{num}</span>
                  {hasGateway ? (
                    <button
                      onClick={() => handleRemove(num, "admin")}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      title="Ta bort samordnare"
                    >
                      <Trash2 size={13} />
                    </button>
                  ) : (
                    <span className="text-stone-300 p-1" title="Kräver Gateway-behörighet för att ta bort">
                      <Lock size={12} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-brand-bg/50 p-3 rounded-xl border border-brand-ink/5">
          <div className="flex items-center gap-1.5 font-medium text-slate-700 mb-2">
            <Star size={14} className="text-amber-500" />
            <span>Betrodda Skapare ({trusted.length})</span>
          </div>
          {trusted.length === 0 ? (
            <p className="text-[11px] text-slate-400 italic">Inga betrodda avsändare.</p>
          ) : (
            <ul className="space-y-1.5">
              {trusted.map(num => (
                <li key={num} className="flex items-center justify-between bg-white p-2 rounded-lg border border-brand-ink/5 font-mono text-[11px]">
                  <span>{num}</span>
                  <button
                    onClick={() => handleRemove(num, "trusted")}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    title="Ta bort betrodd"
                  >
                    <Trash2 size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
