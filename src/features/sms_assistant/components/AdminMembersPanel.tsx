// [src/features/sms_assistant/components/AdminMembersPanel.tsx] - Admin & Trusted Members Management

import React, { useState, useEffect } from "react";
import { Users, UserPlus, Shield, Star, Trash2 } from "lucide-react";

export function AdminMembersPanel() {
  const [admins, setAdmins] = useState<string[]>([]);
  const [trusted, setTrusted] = useState<string[]>([]);
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "trusted">("admin");
  const [loading, setLoading] = useState(false);

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

  const handleAdd = async () => {
    if (!newPhone.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/members/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: newPhone.trim(), role: newRole })
      });
      if (res.ok) {
        setNewPhone("");
        fetchMembers();
      } else {
        const err = await res.json();
        alert(err.error || "Kunde inte lägga till numret.");
      }
    } catch (e) {
      alert("Nätverksfel vid tillägg.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (phone: string, role: "admin" | "trusted") => {
    if (!confirm(`Ta bort ${phone} från ${role === 'admin' ? 'admin' : 'betrodda'}?`)) return;
    try {
      const res = await fetch("/api/admin/members/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, role })
      });
      if (res.ok) {
        fetchMembers();
      }
    } catch (e) {
      alert("Kunde inte ta bort numret.");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-xs border border-brand-ink/10 space-y-4">
      <div className="flex items-center gap-2 border-b border-brand-ink/5 pb-3">
        <Users className="text-brand-accent shrink-0" size={18} />
        <h3 className="font-semibold text-xs tracking-wider uppercase">Platt Admin & Betrodda Skapare</h3>
      </div>

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
          onChange={e => setNewRole(e.target.value as "admin" | "trusted")}
          className="p-2 bg-brand-bg rounded-lg border border-brand-ink/10 text-xs font-mono"
        >
          <option value="admin">Admin</option>
          <option value="trusted">Betrodd</option>
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
          <div className="flex items-center gap-1.5 font-medium text-slate-700 mb-2">
            <Shield size={14} className="text-blue-600" />
            <span>Administratörer ({admins.length})</span>
          </div>
          {admins.length === 0 ? (
            <p className="text-[11px] text-slate-400 italic">Inga adminnummer angivna.</p>
          ) : (
            <ul className="space-y-1.5">
              {admins.map(num => (
                <li key={num} className="flex items-center justify-between bg-white p-2 rounded-lg border border-brand-ink/5 font-mono text-[11px]">
                  <span>{num}</span>
                  <button
                    onClick={() => handleRemove(num, "admin")}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    title="Ta bort admin"
                  >
                    <Trash2 size={13} />
                  </button>
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
