import React, { useState, useEffect } from "react";
import { Trash2, Send, MapPin, Calendar, Users, Languages, ShieldCheck, ArrowLeft, RotateCcw } from "lucide-react";
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
          throw new Error(body.error || "Misslyckades att hämta larm.");
        }
        const data = await res.json();
        if (active) {
          setAlert(data);
          // Set some standard elder-friendly templates as default response options
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
        throw new Error(body.error || "Misslyckades att skicka svar.");
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
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-bold">Hämtar larmdata från volatile server-RAM...</p>
      </div>
    );
  }

  if (error || success) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 max-w-xl mx-auto text-center">
        {success ? (
          <>
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <ShieldCheck size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Svar skickat & Amnesi triggad!</h2>
            <div className="text-sm bg-slate-50 text-slate-600 p-5 rounded-2xl border border-slate-100 text-left leading-relaxed space-y-3">
              <p>
                <strong>1. Svar levererat:</strong> Ditt svar har vidarebefordrats anonymt till rätt missionärspar.
              </p>
              <p>
                <strong>2. Amnesi-protokoll fullbordat:</strong> Larmdata och tillfälliga spårningskopplingar har raderats permanent från serverns RAM. Det finns absolut noll historik sparad.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Larmet är borta</h2>
            <p className="text-slate-500 leading-relaxed text-sm">
              Larmet hittades inte. Det har antingen tagits bort permanent via Amnesi-protokollet av en annan volontär, eller så har det automatiskt förfallit efter utgånget tidsspann (TTL).
            </p>
          </>
        )}

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Tillbaka till onboarding
          </button>
        </div>
      </div>
    );
  }

  if (!alert) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header card with back button */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 hover:bg-slate-100 text-slate-600 font-bold rounded-xl transition-all flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          <span>Tillbaka</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></div>
          <span className="text-xs font-mono font-bold text-slate-500">LARM: {alert.id}</span>
        </div>
      </div>

      {/* Main Alert Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
            Aktivt Behov
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 mt-3 tracking-tight">
            Behov i {alert.area}
          </h2>
        </div>

        {/* Clean, scrubbed details in human readable rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <MapPin className="text-blue-600" size={24} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Plats (Ungefärlig)</div>
              <div className="text-base font-bold text-slate-800">{alert.locationName}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <Calendar className="text-blue-600" size={24} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Tidpunkt</div>
              <div className="text-base font-bold text-slate-800">{alert.time}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <Users className="text-blue-600" size={24} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Kategori</div>
              <div className="text-base font-bold text-slate-800">{alert.gender}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <Languages className="text-blue-600" size={24} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Språk</div>
              <div className="text-base font-bold text-slate-800">{alert.language}</div>
            </div>
          </div>
        </div>

        {/* Spatial Cloaking Section */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-400" size={20} />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-400">
              Spatial Cloaking skydd
            </h4>
          </div>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Undersökarens exakta position skyddas genom att avrunda GPS-koordinaterna till jämna 0.02-steg (~2x2 km geobox). 
            Din app ser endast det allmänna grannskapet.
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
            <div>
              <div className="text-slate-500 text-[10px]">AVRUNDADE GPS KOORDINATER</div>
              <div className="text-slate-200 mt-0.5">
                Lat: {alert.cloakedCoords?.lat?.toFixed(3) || "N/A"}, Lng: {alert.cloakedCoords?.lng?.toFixed(3) || "N/A"}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                SÄKER GEOBOX AKTIV
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Svarsformulär */}
      <form onSubmit={handleRespond} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-950">Skicka ditt svar</h3>
          <p className="text-slate-500 text-sm mt-1">
            Skriv ditt meddelande eller välj ett av de föreslagna snabbsvaren nedan.
          </p>
        </div>

        {/* Quick buttons for elder accessibility */}
        <div className="flex flex-wrap gap-2">
          {[
            "Jag kan vara med!",
            "Jag deltar gärna via video/telefon.",
            "Min fru syster Y är på väg!",
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
            Svarsmeddelande till missionärerna
          </label>
          <textarea
            value={responseText}
            onChange={e => setResponseText(e.target.value)}
            rows={3}
            className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-base font-medium placeholder-slate-400 transition-all resize-none"
            placeholder="Skriv svar här..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={sending || !responseText.trim()}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-black text-lg rounded-2xl transition-all shadow-lg shadow-emerald-600/10 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          {sending ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Send size={20} />
              Skicka svar & Trigger Amnesi
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          När du klickar på Skicka vidarebefordras ditt svar direkt till missionärernas WhatsApp. I samma ögonblick raderas detta larm, dess koordinater och kopplingar permanent och oåterkalleligt från serverns RAM.
        </p>
      </form>
    </div>
  );
}
