import React, { useState, useEffect } from "react";
import { Trash2, Send, MapPin, Calendar, Users, Languages, ShieldCheck, ArrowLeft } from "lucide-react";
import { ActiveAlert } from "../types";

// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

interface AlertDetailProps {
  alertId: string;
  onBack: () => void;
}

export default function AlertDetail({ alertId, onBack }: AlertDetailProps) {
  const [alert, setAlert] = useState<ActiveAlert | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    async function fetchAlert() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/alerts/${alertId}`);
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error || "Misslyckades att hämta förfrågan.");
        }
        const data = await res.json();
        if (active) {
          setAlert(data);
          setResponseText("Jag kan vara med!");
        }
      } catch (err: any) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    fetchAlert();
    return () => {
      active = false;
    };
  }, [alertId]);

  const handleRespond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    try {
      setSending(true);
      const res = await fetch(`/api/alerts/${alertId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseText })
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Misslyckades att skicka ditt svar.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-semibold">Hämtar information om förfrågan...</p>
      </div>
    );
  }

  if (error || success) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6 max-w-xl mx-auto text-center">
        {success ? (
          <>
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Ditt svar har skickats!</h2>
            <div className="text-sm bg-slate-50 text-slate-600 p-6 rounded-2xl border border-slate-100 text-left leading-relaxed space-y-3">
              <p>
                <strong>1. Svaret har levererats:</strong> Ditt meddelande har vidarebefordrats helt anonymt till rätt missionärspar.
              </p>
              <p>
                <strong>2. Förfrågan har stängts:</strong> För allas trygghet har detta behov och tillhörande data raderats permanent. Inga spår eller personuppgifter lagras i systemet.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Förfrågan har redan besvarats</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Denna förfrågan är inte längre tillgänglig. Antingen har en annan stödmedlem redan tackat ja och tagit sig an mötet (vilket stänger och raderar förfrågan direkt), eller så har tiden för mötet redan passerat.
            </p>
          </>
        )}

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Tillbaka till startsidan
          </button>
        </div>
      </div>
    );
  }

  if (!alert) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header card with back button */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-all flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          <span>Tillbaka</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-ping"></div>
          <span className="text-xs font-semibold text-slate-500">Aktiv förfrågan</span>
        </div>
      </div>

      {/* Main Alert Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
            Aktuellt missionsbehov
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-3 tracking-tight">
            Missionsbehov i {alert.area}
          </h2>
        </div>

        {/* Clean, scrubbed details in human readable rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
            <MapPin className="text-teal-600 shrink-0" size={24} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Plats (Ungefärlig)</div>
              <div className="text-base font-bold text-slate-800">{alert.locationName}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
            <Calendar className="text-teal-600 shrink-0" size={24} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Tidpunkt</div>
              <div className="text-base font-bold text-slate-800">{alert.time}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
            <Users className="text-teal-600 shrink-0" size={24} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Deltagare</div>
              <div className="text-base font-bold text-slate-800">{alert.gender}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
            <Languages className="text-teal-600 shrink-0" size={24} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Språk</div>
              <div className="text-base font-bold text-slate-800">{alert.language}</div>
            </div>
          </div>
        </div>

        {/* Friendly Integrity Note (Replacing scary Spatial Cloaking) */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2 text-sm text-slate-600 leading-relaxed">
          <p>
            <strong className="text-slate-800">För allas trygghet och integritet:</strong> Tjänsten visar endast den ungefärliga mötesplatsen och det allmänna grannskapet, inte exakta adresser. Det ger tillräcklig information för att du ska veta om du kan delta, samtidigt som medlemmens integritet värnas till fullo.
          </p>
        </div>
      </div>

      {/* Svarsformulär */}
      <form onSubmit={handleRespond} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-950">Besvara förfrågan</h3>
          <p className="text-slate-500 text-sm mt-1">
            Skriv ett kort svar eller välj ett av de färdiga alternativen nedan.
          </p>
        </div>

        {/* Quick buttons for elder accessibility */}
        <div className="flex flex-wrap gap-2">
          {[
            "Jag kan vara med!",
            "Jag deltar gärna via video/telefon.",
            "Min man/fru/vän följer också med!",
            "Jag möter upp er vid angiven tid."
          ].map(quick => (
            <button
              key={quick}
              type="button"
              onClick={() => setResponseText(quick)}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
            >
              {quick}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
            Ditt meddelande till missionärerna
          </label>
          <textarea
            value={responseText}
            onChange={e => setResponseText(e.target.value)}
            rows={3}
            className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-teal-600 focus:outline-none text-base font-semibold placeholder-slate-400 transition-all resize-none text-slate-800"
            placeholder="Skriv svar här..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={sending || !responseText.trim()}
          className="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white font-bold text-lg rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          {sending ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Send size={20} />
              Skicka svar och hjälp till
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          Ditt svar skickas helt anonymt och säkert vidare till missionärerna. För att skydda allas integritet raderas denna förfrågan permanent från vårt tillfälliga minne så snart du klickat på skicka.
        </p>
      </form>
    </div>
  );
}
