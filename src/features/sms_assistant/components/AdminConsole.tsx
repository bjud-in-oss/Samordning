import React, { useState } from "react";
import { RefreshCw, Tag, MapPin, Calendar, Trash2 } from "lucide-react";
import { PairingGate } from "./PairingGate";
import { AdminConsoleHeader } from "./AdminConsoleHeader";
import { PendingAlertsQueue } from "./PendingAlertsQueue";
import { AdminMembersPanel } from "./AdminMembersPanel";
import { useAdminConsole } from "../hooks/useAdminConsole";

interface AdminConsoleProps {
  onBack?: () => void;
  onPairSuccess?: () => void;
}

export function AdminConsole({ onBack, onPairSuccess }: AdminConsoleProps) {
  const [deviceToken] = useState<string>(() => {
    let token = localStorage.getItem("admin_device_token");
    if (!token) {
      token = "dev_tok_" + Math.random().toString(36).substring(2, 10);
      localStorage.setItem("admin_device_token", token);
    }
    return token;
  });

  const {
    isPaired,
    pendingAlerts,
    activeAlertsList,
    activeTab,
    setActiveTab,
    checkPairingStatus,
    fetchAlerts,
    handleApprove,
    handleRejectOrDelete,
    handleLogout,
  } = useAdminConsole({ onBack, onPairSuccess, deviceToken });

  if (!isPaired) {
    return (
      <PairingGate
        token={deviceToken}
        onRefresh={() => checkPairingStatus(deviceToken)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg font-sans text-brand-ink">
      <AdminConsoleHeader onBack={onBack} onLogout={handleLogout} />

      {/* Flikar */}
      <div className="bg-white border-b border-brand-ink/10 px-4 py-2 flex gap-2">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === "pending"
              ? "bg-brand-accent text-white"
              : "bg-brand-bg text-brand-ink/70 hover:text-brand-ink"
          }`}
        >
          Väntande förslag ({pendingAlerts.length})
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === "active"
              ? "bg-brand-accent text-white"
              : "bg-brand-bg text-brand-ink/70 hover:text-brand-ink"
          }`}
        >
          Aktiva anslag ({activeAlertsList.length})
        </button>
        <button
          onClick={() => setActiveTab("members")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === "members"
              ? "bg-brand-accent text-white"
              : "bg-brand-bg text-brand-ink/70 hover:text-brand-ink"
          }`}
        >
          Telefonnummer & Behörigheter
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto max-w-4xl w-full mx-auto space-y-4">
        {activeTab === "pending" && (
          <PendingAlertsQueue
            pendingAlerts={pendingAlerts}
            onFetchPending={fetchAlerts}
            onApprove={handleApprove}
            onReject={(id) => handleRejectOrDelete(id, true)}
          />
        )}

        {activeTab === "active" && (
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-brand-ink/10 space-y-3">
            <div className="flex items-center justify-between border-b border-brand-ink/5 pb-2">
              <h3 className="font-semibold text-xs tracking-wider uppercase text-brand-ink/80">
                Publicerade anslag på servern ({activeAlertsList.length})
              </h3>
              <button
                onClick={fetchAlerts}
                className="text-[11px] text-brand-accent hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={12} />
                <span>Uppdatera</span>
              </button>
            </div>

            {activeAlertsList.length === 0 ? (
              <p className="text-xs text-brand-ink/40 italic py-4 text-center">Inga aktiva anslag just nu.</p>
            ) : (
              <div className="space-y-2">
                {activeAlertsList.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 bg-brand-bg rounded-xl border border-brand-ink/10 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2 font-mono text-[10px] text-brand-accent font-semibold">
                        <span>#{alert.id}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Tag size={10} />{alert.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin size={10} />{alert.area}</span>
                        {alert.time && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Calendar size={10} />{alert.time}</span>
                          </>
                        )}
                      </div>
                      <p className="font-serif italic text-brand-ink text-sm">
                        {alert.scrubbedText || alert.rawText}
                      </p>
                      <div className="text-[10px] text-brand-ink/60">
                        Arrangör: {alert.responsibleParty || "Församlingen"}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Vill du ta bort anslag #${alert.id} permanent från servern?`)) {
                          handleRejectOrDelete(alert.id);
                        }
                      }}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Ta bort anslag från servern"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "members" && <AdminMembersPanel />}
      </div>
    </div>
  );
}

export default AdminConsole;
