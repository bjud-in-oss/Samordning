// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Single Page Form with In-Place Dialogs & Named Favorites

import React, { useState } from "react";
import { Send, CheckCircle, Sparkles, ArrowLeft, Clock, MapPin, Users, Globe, Star, Trash2, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import { UiLanguage } from "../mission_router/translations";
import { GOTEBORG_AREAS } from "../anpassa/mapData";
import { washAnnouncementText } from "../mission_router/domain/parser";

export interface CreateInvitationFormProps {
  uiLanguage: UiLanguage;
  savedTags?: any;
  isAdmin?: boolean;
  onBack?: () => void;
  onSuccess?: () => void;
}

const POI_LOCATIONS = [
  "Tjörn & Stenungsund",
  "Kungälv",
  "Gråbo & Olofstorp",
  "Angered & Hjällbo",
  "Kortedala Norra",
  "Bergsjön & Gärdsås",
  "Kortedala & Bellevue",
  "Utby & Utbynäs",
  "Hisingen",
  "Sävedalen / Partille Norra",
  "Furulund / Partille Södra",
  "Kålltorp / Olskroken & Bagaregården",
  "Landvetter & Härryda"
];

const AUDIENCE_OPTIONS = [
  "Alla målgrupper",
  "Barn & Familj",
  "Ungdom (12–17 år)",
  "Unga Vuxna (18–35 år)",
  "Kvinnor",
  "Män"
];

const ORGANIZATIONS = [
  "Enskild/Familj",
  "Missionärer",
  "Primärföreningen",
  "Hjälpföreningen",
  "Äldstekvorum",
  "Aktivitetskommitten",
  "Biskopsrådet",
  "Staven"
];

const QUICK_TIMES = [
  "Idag kl 18:00",
  "Ikväll kl 19:00",
  "Imorgon kl 15:00",
  "Lördag kl 10:00",
  "Söndag kl 11:00"
];

interface FavoriteItem {
  id: string;
  name: string;
  time: string;
  location: string;
  areas: string[];
  audience: string[];
  organization: string;
  organizerName: string;
  activity: string;
  isRecurring: boolean;
  reminderTime: string;
}

export default function CreateInvitationForm({
  uiLanguage,
  savedTags,
  isAdmin = false,
  onBack,
  onSuccess
}: CreateInvitationFormProps) {
  // Favorites with custom names in localStorage
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("mission_router_named_favorites");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [favModalOpen, setFavModalOpen] = useState(false);
  const [newFavName, setNewFavName] = useState("");

  // Form State
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [locationName, setLocationName] = useState<string>("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<string[]>(["Alla målgrupper"]);
  const [activityText, setActivityText] = useState<string>("");
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [organizerPersonName, setOrganizerPersonName] = useState<string>("");

  // Recurring & Reminder states
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [hasReminder, setHasReminder] = useState<boolean>(false);
  const [reminderTime, setReminderTime] = useState<string>("1 timme innan");

  // Mandatory Privacy Consent Checkbox
  const [consentConfirmed, setConsentConfirmed] = useState<boolean>(false);

  // Active In-place Dialog
  const [activeDialog, setActiveDialog] = useState<"time" | "location" | "activity" | "area" | "audience" | "organization" | null>(null);

  // Temporary dialog buffers
  const [tempLocation, setTempLocation] = useState<string>("");
  const [tempAreas, setTempAreas] = useState<string[]>([]);
  const [tempAudience, setTempAudience] = useState<string[]>([]);
  const [tempOrg, setTempOrg] = useState<string>("");
  const [tempActivity, setTempActivity] = useState<string>("");
  const [tempTime, setTempTime] = useState<string>("");
  const [showPersonNameModal, setShowPersonNameModal] = useState<boolean>(false);
  const [showQrSection, setShowQrSection] = useState<boolean>(false);

  // AI Moderation & Submission
  const [sending, setSending] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // AI Flag Modal State
  const [aiFlagModal, setAiFlagModal] = useState<{ open: boolean; message: string }>({ open: false, message: "" });

  const gatewayNumber = "0736108997";

  // Formatted Output Text
  const formattedText = [
    selectedTime ? `Tid: ${selectedTime}` : "",
    locationName ? `Mötesplats: ${locationName}` : "",
    selectedAreas.length > 0 ? `Bjud in från områden: ${selectedAreas.join(", ")}` : "",
    selectedAudience.length > 0 ? `Målgrupp: ${selectedAudience.join(", ")}` : "",
    selectedOrganization ? `Arrangör: ${selectedOrganization}${organizerPersonName ? ` (${organizerPersonName})` : ""}` : "",
    activityText ? `Aktivitet: ${washAnnouncementText(activityText)}` : "",
    hasReminder && reminderTime ? `Påminnelse: ${reminderTime}` : "",
    isRecurring ? `Upprepas: Varje vecka` : ""
  ].filter(Boolean).join("\n");

  const isFormValid =
    Boolean(selectedTime.trim()) &&
    Boolean(locationName.trim()) &&
    Boolean(activityText.trim()) &&
    Boolean(selectedOrganization.trim()) &&
    selectedAudience.length > 0 &&
    consentConfirmed;

  // Favorites Handlers
  const handleSaveFavorite = () => {
    if (!newFavName.trim()) return;
    const newFav: FavoriteItem = {
      id: Date.now().toString(),
      name: newFavName.trim(),
      time: selectedTime,
      location: locationName,
      areas: selectedAreas,
      audience: selectedAudience,
      organization: selectedOrganization,
      organizerName: organizerPersonName,
      activity: activityText,
      isRecurring,
      reminderTime: hasReminder ? reminderTime : ""
    };
    const updated = [newFav, ...favorites.slice(0, 9)];
    setFavorites(updated);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("mission_router_named_favorites", JSON.stringify(updated));
    }
    setNewFavName("");
    setFavModalOpen(false);
    setToast(`Inbjudan sparades som favoriten "${newFav.name}"!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApplyFavorite = (fav: FavoriteItem) => {
    setSelectedTime(fav.time || "");
    setLocationName(fav.location || "");
    setSelectedAreas(fav.areas || []);
    setSelectedAudience(fav.audience || ["Alla målgrupper"]);
    setSelectedOrganization(fav.organization || "");
    setOrganizerPersonName(fav.organizerName || "");
    setActivityText(fav.activity || "");
    setIsRecurring(!!fav.isRecurring);
    if (fav.reminderTime) {
      setHasReminder(true);
      setReminderTime(fav.reminderTime);
    } else {
      setHasReminder(false);
    }
    setToast(`Laddade in favoriten "${fav.name}"`);
    setTimeout(() => setToast(null), 2500);
  };

  const handleRemoveFavorite = (favId: string) => {
    const updated = favorites.filter(f => f.id !== favId);
    setFavorites(updated);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("mission_router_named_favorites", JSON.stringify(updated));
    }
  };

  // Submission / AI Check
  const handleAttemptPublish = async () => {
    if (!isFormValid) return;

    setSending(true);
    try {
      const response = await fetch("/api/wash-announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: formattedText })
      });
      const data = await response.json();

      if (data.result?.hasPrivacyRisk || data.result?.hasInappropriateContent) {
        setAiFlagModal({
          open: true,
          message: data.result.reason || "Inbjudan innehåller information som kan vara känslig eller behöver granskas extra noga."
        });
        setSending(false);
        return;
      }

      await executePublish();
    } catch (err) {
      console.error("AI Check error:", err);
      await executePublish();
    }
  };

  const executePublish = async () => {
    setSending(true);
    try {
      const response = await fetch("/api/sim/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "0700000000",
          body: `#WEBB\n${formattedText}`
        })
      });

      if (response.ok) {
        setToast("Din inbjudan har skickats in för granskning och publicering!");
        setTimeout(() => setToast(null), 4000);
        if (onSuccess) onSuccess();
      } else {
        alert("Kunde inte publicera inbjudan. Försök igen.");
      }
    } catch (err) {
      console.error("Publish error:", err);
      alert("Nätverksfel vid publicering.");
    } finally {
      setSending(false);
      setAiFlagModal({ open: false, message: "" });
    }
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const smsPayload = `#WEBB\n${formattedText}`;
  const smsHref = `sms:${gatewayNumber}?body=${encodeURIComponent(smsPayload)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(smsHref)}`;

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto text-left">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-brand-ink/60 hover:text-brand-ink transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Visa dina inbjudningar igen</span>
        </button>
      )}

      {toast && (
        <div className="p-4 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-mono uppercase tracking-wider rounded-2xl flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle size={16} className="text-brand-accent shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-brand-ink/5 space-y-6">
        <div>
          <h2 className="font-serif italic text-2xl sm:text-3xl font-medium text-brand-ink">
            Bjud in andra
          </h2>
          <p className="text-brand-ink/80 text-xs sm:text-sm leading-relaxed font-light mt-1">
            Bjud in andra att vara en vän, hämta näring i Guds ord eller hjälpa andra
          </p>
        </div>

        {/* Saved Favorites Pills */}
        {favorites.length > 0 && (
          <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber-900 font-semibold flex items-center gap-1">
              <Star size={12} className="text-amber-600 fill-amber-500" />
              Mina sparade favoriter
            </span>
            <div className="flex flex-wrap gap-2">
              {favorites.map((fav) => (
                <div key={fav.id} className="inline-flex items-center gap-1.5 bg-white border border-amber-200/90 rounded-xl px-3 py-1.5 text-xs font-mono shadow-2xs">
                  <button
                    type="button"
                    onClick={() => handleApplyFavorite(fav)}
                    className="text-brand-ink hover:text-brand-accent transition-colors font-medium text-left"
                  >
                    ⭐ {fav.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveFavorite(fav.id)}
                    className="text-brand-ink/40 hover:text-rose-600 ml-1 p-0.5"
                    title="Ta bort favorit"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Title */}
        <div className="space-y-3 pt-1">
          <label className="font-mono text-[10px] uppercase tracking-wider text-brand-accent font-semibold block">
            Beskriv din inbjudan i knapparna nedan:
          </label>

          {/* IN-PLACE DIALOG CONTAINER OR BUTTON BAR */}
          {activeDialog === null ? (
            /* MAIN BUTTON BAR */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setTempTime(selectedTime);
                  setActiveDialog("time");
                }}
                className={`p-3.5 border rounded-2xl text-xs font-mono text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedTime
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold"
                    : "bg-brand-paper/50 hover:bg-brand-paper border-brand-ink/10 text-brand-ink"
                }`}
              >
                <div className="flex items-center gap-2 truncate mr-1">
                  <Clock size={15} className={selectedTime ? "text-emerald-700" : "text-brand-accent"} />
                  <span className="truncate">{selectedTime ? `Tid: ${selectedTime}` : "Tid"}</span>
                </div>
                {selectedTime && <Check size={14} className="text-emerald-700 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTempLocation(locationName);
                  setActiveDialog("location");
                }}
                className={`p-3.5 border rounded-2xl text-xs font-mono text-left flex items-center justify-between transition-all cursor-pointer ${
                  locationName
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold"
                    : "bg-brand-paper/50 hover:bg-brand-paper border-brand-ink/10 text-brand-ink"
                }`}
              >
                <div className="flex items-center gap-2 truncate mr-1">
                  <MapPin size={15} className={locationName ? "text-emerald-700" : "text-brand-accent"} />
                  <span className="truncate">{locationName ? `Plats: ${locationName}` : "Plats"}</span>
                </div>
                {locationName && <Check size={14} className="text-emerald-700 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTempActivity(activityText);
                  setActiveDialog("activity");
                }}
                className={`p-3.5 border rounded-2xl text-xs font-mono text-left flex items-center justify-between transition-all cursor-pointer ${
                  activityText
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold"
                    : "bg-brand-paper/50 hover:bg-brand-paper border-brand-ink/10 text-brand-ink"
                }`}
              >
                <div className="flex items-center gap-2 truncate mr-1">
                  <Sparkles size={15} className={activityText ? "text-emerald-700" : "text-brand-accent"} />
                  <span className="truncate">{activityText ? "Aktivitet ✓" : "Aktivitet"}</span>
                </div>
                {activityText && <Check size={14} className="text-emerald-700 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTempAreas(selectedAreas);
                  setActiveDialog("area");
                }}
                className={`p-3.5 border rounded-2xl text-xs font-mono text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedAreas.length > 0
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold"
                    : "bg-brand-paper/50 hover:bg-brand-paper border-brand-ink/10 text-brand-ink"
                }`}
              >
                <div className="flex items-center gap-2 truncate mr-1">
                  <Globe size={15} className={selectedAreas.length > 0 ? "text-emerald-700" : "text-brand-accent"} />
                  <span className="truncate">
                    {selectedAreas.length > 0 ? `Område (${selectedAreas.length})` : "Område"}
                  </span>
                </div>
                {selectedAreas.length > 0 && <Check size={14} className="text-emerald-700 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTempAudience(selectedAudience);
                  setActiveDialog("audience");
                }}
                className={`p-3.5 border rounded-2xl text-xs font-mono text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedAudience.length > 0
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold"
                    : "bg-brand-paper/50 hover:bg-brand-paper border-brand-ink/10 text-brand-ink"
                }`}
              >
                <div className="flex items-center gap-2 truncate mr-1">
                  <Users size={15} className={selectedAudience.length > 0 ? "text-emerald-700" : "text-brand-accent"} />
                  <span className="truncate">
                    {selectedAudience.length > 0 ? `Målgrupp: ${selectedAudience[0]}` : "Målgrupp"}
                  </span>
                </div>
                {selectedAudience.length > 0 && <Check size={14} className="text-emerald-700 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTempOrg(selectedOrganization);
                  setActiveDialog("organization");
                }}
                className={`p-3.5 border rounded-2xl text-xs font-mono text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedOrganization
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold"
                    : "bg-brand-paper/50 hover:bg-brand-paper border-brand-ink/10 text-brand-ink"
                }`}
              >
                <div className="flex items-center gap-2 truncate mr-1">
                  <Users size={15} className={selectedOrganization ? "text-emerald-700" : "text-brand-accent"} />
                  <span className="truncate">
                    {selectedOrganization ? `Arrangör: ${selectedOrganization}` : "Arrangör"}
                  </span>
                </div>
                {selectedOrganization && <Check size={14} className="text-emerald-700 shrink-0" />}
              </button>
            </div>
          ) : (
            /* IN-PLACE DIALOG BOXES */
            <div className="p-5 bg-brand-paper/60 rounded-3xl border border-brand-ink/10 space-y-4 animate-in fade-in duration-200">
              
              {/* DIALOG 1: TID */}
              {activeDialog === "time" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-brand-ink/10 pb-2">
                    <span className="font-serif italic text-lg font-medium text-brand-ink">
                      Tid: (När träffas vi?)
                    </span>
                  </div>

                  <div className="space-y-3">
                    <label className="font-mono text-[10px] uppercase text-brand-ink/60 block">Snabbval datum & dag:</label>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_TIMES.map(qt => (
                        <button
                          key={qt}
                          type="button"
                          onClick={() => setTempTime(qt)}
                          className={`px-3 py-1.5 rounded-xl border font-mono text-xs cursor-pointer transition-all ${
                            tempTime === qt
                              ? "bg-brand-accent text-white border-brand-accent font-semibold"
                              : "bg-white border-brand-ink/10 text-brand-ink hover:border-brand-accent"
                          }`}
                        >
                          {qt}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <label className="font-mono text-[10px] uppercase text-brand-ink/60 block mb-1">Eller skriv egen tid / datum:</label>
                      <input
                        type="text"
                        value={tempTime}
                        onChange={e => setTempTime(e.target.value)}
                        placeholder="t.ex. Lördag 15 mars kl 14:00"
                        className="w-full px-4 py-2.5 bg-white border border-brand-ink/15 rounded-xl font-mono text-xs text-brand-ink focus:outline-none focus:border-brand-accent"
                      />
                    </div>

                    {/* Recurring & Reminder checkboxes */}
                    <div className="pt-2 space-y-2 border-t border-brand-ink/10">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isRecurring}
                          onChange={e => setIsRecurring(e.target.checked)}
                          className="rounded border-brand-ink/30 text-brand-accent focus:ring-0"
                        />
                        <span className="font-mono text-xs text-brand-ink">Upprepad avisering / regelbunden tid (Varje vecka)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasReminder}
                          onChange={e => setHasReminder(e.target.checked)}
                          className="rounded border-brand-ink/30 text-brand-accent focus:ring-0"
                        />
                        <span className="font-mono text-xs text-brand-ink">Skicka extra påminnelse</span>
                      </label>

                      {hasReminder && (
                        <div className="pl-6 pt-1">
                          <input
                            type="text"
                            value={reminderTime}
                            onChange={e => setReminderTime(e.target.value)}
                            placeholder="t.ex. 1 timme innan"
                            className="px-3 py-1.5 bg-white border border-brand-ink/15 rounded-lg font-mono text-xs text-brand-ink"
                          />
                        </div>
                      )}

                      <p className="text-[10px] font-mono text-brand-ink/50 italic pt-1">
                        Schemalagda och upprepade aktiviteter skall kunna ändras eller tas bort av skaparen eller administratörer.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-ink/10">
                    <button
                      type="button"
                      onClick={() => setActiveDialog(null)}
                      className="px-4 py-2 bg-white border border-brand-ink/15 text-brand-ink rounded-xl font-mono text-xs uppercase"
                    >
                      Ångra
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTime(tempTime);
                        setActiveDialog(null);
                      }}
                      className="px-5 py-2 bg-brand-accent text-white rounded-xl font-mono text-xs uppercase font-semibold"
                    >
                      Klar
                    </button>
                  </div>
                </div>
              )}

              {/* DIALOG 2: MÖTESPLATS (Fritext med KML/POI-matchning) */}
              {activeDialog === "location" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-brand-ink/10 pb-2">
                    <span className="font-serif italic text-lg font-medium text-brand-ink">
                      Mötesplats: (Var ses vi?)
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="font-mono text-[10px] uppercase text-brand-ink/60 block mb-1">
                        Skriv fri adress, platsnamn eller lokal:
                      </label>
                      <input
                        type="text"
                        value={tempLocation}
                        onChange={e => {
                          const val = e.target.value;
                          setTempLocation(val);
                          // Auto match against POI districts if selectedAreas is empty
                          const matchedPoi = POI_LOCATIONS.find(poi => 
                            val.toLowerCase().includes(poi.split(" ")[0].toLowerCase())
                          );
                          if (matchedPoi && selectedAreas.length === 0) {
                            setSelectedAreas([matchedPoi]);
                          }
                        }}
                        placeholder="t.ex. Utby kyrka, Utbyvägen 10 eller Slottsskogen"
                        className="w-full px-4 py-2.5 bg-white border border-brand-ink/15 rounded-xl font-mono text-xs text-brand-ink focus:outline-none focus:border-brand-accent"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[10px] uppercase text-brand-ink/60 block mb-2">
                        Eller välj snabbt bland kända område/platser (KML POI):
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                        {POI_LOCATIONS.map(poi => (
                          <button
                            key={poi}
                            type="button"
                            onClick={() => {
                              setTempLocation(poi);
                              if (selectedAreas.length === 0) {
                                setSelectedAreas([poi]);
                              }
                            }}
                            className={`p-2.5 rounded-xl border font-mono text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                              tempLocation === poi
                                ? "bg-brand-accent text-white border-brand-accent font-semibold"
                                : "bg-white border-brand-ink/10 text-brand-ink hover:border-brand-accent/50"
                            }`}
                          >
                            <span>{poi}</span>
                            {tempLocation === poi && <Check size={14} className="text-white shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-ink/10">
                    <button
                      type="button"
                      onClick={() => setActiveDialog(null)}
                      className="px-4 py-2 bg-white border border-brand-ink/15 text-brand-ink rounded-xl font-mono text-xs uppercase"
                    >
                      Ångra
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLocationName(tempLocation);
                        setActiveDialog(null);
                      }}
                      className="px-5 py-2 bg-brand-accent text-white rounded-xl font-mono text-xs uppercase font-semibold"
                    >
                      Klar
                    </button>
                  </div>
                </div>
              )}

              {/* DIALOG 3: AKTIVITET */}
              {activeDialog === "activity" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-brand-ink/10 pb-2">
                    <span className="font-serif italic text-lg font-medium text-brand-ink">
                      Aktivitet: (Beskriv aktiviteten)
                    </span>
                  </div>

                  <textarea
                    rows={4}
                    value={tempActivity}
                    onChange={e => setTempActivity(e.target.value)}
                    placeholder="Beskriv vad ni ska göra, t.ex. 'Vi dricker fika och pratar om söndagens läsningar', eller 'Promenad runt sjön'..."
                    className="w-full p-3.5 bg-white border border-brand-ink/15 focus:border-brand-accent rounded-2xl font-mono text-xs text-brand-ink focus:outline-none resize-none leading-relaxed"
                  />

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveDialog(null)}
                      className="px-4 py-2 bg-white border border-brand-ink/15 text-brand-ink rounded-xl font-mono text-xs uppercase"
                    >
                      Avbryt
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActivityText(tempActivity);
                        setActiveDialog(null);
                      }}
                      className="px-5 py-2 bg-brand-accent text-white rounded-xl font-mono text-xs uppercase font-semibold"
                    >
                      Klar
                    </button>
                  </div>
                </div>
              )}

              {/* DIALOG 4: OMRÅDEN (Flerval, valfritt) */}
              {activeDialog === "area" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-brand-ink/10 pb-2">
                    <span className="font-serif italic text-lg font-medium text-brand-ink">
                      Bjud in från områden: (Vilka närområden bjuder du in från?)
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pb-1">
                    <button
                      type="button"
                      onClick={() => setTempAreas([...POI_LOCATIONS])}
                      className="px-3 py-1.5 bg-white border border-brand-ink/10 text-brand-ink font-mono text-[11px] uppercase rounded-xl"
                    >
                      ⚡ Markera alla
                    </button>
                    <button
                      type="button"
                      onClick={() => setTempAreas([])}
                      className="px-3 py-1.5 bg-white border border-brand-ink/10 text-brand-ink/60 font-mono text-[11px] uppercase rounded-xl"
                    >
                      ✕ Rensa alla
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                    {POI_LOCATIONS.map(area => {
                      const selected = tempAreas.includes(area);
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => {
                            setTempAreas(prev =>
                              selected ? prev.filter(a => a !== area) : [...prev, area]
                            );
                          }}
                          className={`p-3 rounded-2xl border font-mono text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                            selected
                              ? "bg-brand-accent text-white border-brand-accent font-semibold"
                              : "bg-white border-brand-ink/10 text-brand-ink hover:border-brand-accent/50"
                          }`}
                        >
                          <span>{area}</span>
                          {selected && <Check size={14} className="text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-ink/10">
                    <button
                      type="button"
                      onClick={() => setActiveDialog(null)}
                      className="px-4 py-2 bg-white border border-brand-ink/15 text-brand-ink rounded-xl font-mono text-xs uppercase"
                    >
                      Ångra
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAreas(tempAreas);
                        setActiveDialog(null);
                      }}
                      className="px-5 py-2 bg-brand-accent text-white rounded-xl font-mono text-xs uppercase font-semibold"
                    >
                      Välj
                    </button>
                  </div>
                </div>
              )}

              {/* DIALOG 5: MÅLGRUPP (Flerval) */}
              {activeDialog === "audience" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-brand-ink/10 pb-2">
                    <span className="font-serif italic text-lg font-medium text-brand-ink">
                      Målgrupp: (Vilka målgrupper berörs?)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AUDIENCE_OPTIONS.map(aud => {
                      const selected = tempAudience.includes(aud);
                      return (
                        <button
                          key={aud}
                          type="button"
                          onClick={() => {
                            setTempAudience(prev =>
                              selected ? prev.filter(a => a !== aud) : [...prev, aud]
                            );
                          }}
                          className={`p-3 rounded-2xl border font-mono text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                            selected
                              ? "bg-brand-accent text-white border-brand-accent font-semibold"
                              : "bg-white border-brand-ink/10 text-brand-ink hover:border-brand-accent/50"
                          }`}
                        >
                          <span>{aud}</span>
                          {selected && <Check size={14} className="text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-ink/10">
                    <button
                      type="button"
                      onClick={() => setActiveDialog(null)}
                      className="px-4 py-2 bg-white border border-brand-ink/15 text-brand-ink rounded-xl font-mono text-xs uppercase"
                    >
                      Ångra
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAudience(tempAudience.length > 0 ? tempAudience : ["Alla målgrupper"]);
                        setActiveDialog(null);
                      }}
                      className="px-5 py-2 bg-brand-accent text-white rounded-xl font-mono text-xs uppercase font-semibold"
                    >
                      Välj
                    </button>
                  </div>
                </div>
              )}

              {/* DIALOG 6: ARRANGÖR */}
              {activeDialog === "organization" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-brand-ink/10 pb-2">
                    <span className="font-serif italic text-lg font-medium text-brand-ink">
                      Arrangör: (Vem håller i aktiviteten?)
                    </span>
                  </div>

                  <p className="text-xs text-brand-ink/80 leading-relaxed font-light p-3.5 bg-amber-50/90 border border-amber-200/80 rounded-2xl">
                    Aktiviteten skickas som ett förslag till de ansvariga ledarna för den valda gruppen. Du behöver inte vara orolig om du klickar på en organisation – de granskar förslaget, godkänner det och hör av sig om det finns några frågor.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ORGANIZATIONS.map(org => {
                      const selected = tempOrg === org;
                      return (
                        <button
                          key={org}
                          type="button"
                          onClick={() => setTempOrg(org)}
                          className={`p-3 rounded-2xl border font-mono text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                            selected
                              ? "bg-brand-accent text-white border-brand-accent font-semibold"
                              : "bg-white border-brand-ink/10 text-brand-ink hover:border-brand-accent/50"
                          }`}
                        >
                          <span>{org}</span>
                          {selected && <Check size={14} className="text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {tempOrg === "Enskild/Familj" && (
                    <div className="p-3 bg-white rounded-2xl border border-brand-ink/10 space-y-2">
                      <label className="font-mono text-[10px] uppercase text-brand-ink/70 block font-semibold">
                        Förtydliga med namn (Valfritt):
                      </label>
                      <input
                        type="text"
                        value={organizerPersonName}
                        onChange={e => setOrganizerPersonName(e.target.value)}
                        placeholder="t.ex. Familjen Svensson eller Broder Andersson"
                        className="w-full px-3 py-2 bg-brand-paper/50 border border-brand-ink/15 rounded-xl font-mono text-xs text-brand-ink"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-ink/10">
                    <button
                      type="button"
                      onClick={() => setActiveDialog(null)}
                      className="px-4 py-2 bg-white border border-brand-ink/15 text-brand-ink rounded-xl font-mono text-xs uppercase"
                    >
                      Ångra
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrganization(tempOrg);
                        setActiveDialog(null);
                      }}
                      className="px-5 py-2 bg-brand-accent text-white rounded-xl font-mono text-xs uppercase font-semibold"
                    >
                      Välj
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* NON-EDITABLE LIVE PREVIEW CARD */}
        <div className="space-y-2 pt-2">
          <label className="font-mono text-[10px] uppercase tracking-wider text-brand-accent font-semibold block">
            Förhandsgranskning av inbjudan:
          </label>

          <div className="p-5 bg-brand-paper/40 rounded-2xl border border-brand-ink/10 space-y-2 select-text">
            <p className="font-serif italic text-base sm:text-lg text-brand-ink leading-relaxed whitespace-pre-wrap">
              {formattedText || "Inga uppgifter ifyllda ännu. Tryck på knapparna ovan för att fylla i inbjudan."}
            </p>
          </div>
        </div>

        {/* SAVE FAVORITE BUTTON */}
        <div className="flex justify-end pt-1">
          {favModalOpen ? (
            <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-2xl w-full sm:w-auto">
              <input
                type="text"
                value={newFavName}
                onChange={e => setNewFavName(e.target.value)}
                placeholder="Namnge din favorit..."
                className="px-3 py-1.5 bg-white border border-amber-300 rounded-xl font-mono text-xs text-brand-ink flex-1"
              />
              <button
                type="button"
                onClick={handleSaveFavorite}
                className="px-3 py-1.5 bg-amber-600 text-white font-mono text-xs uppercase rounded-xl font-semibold shrink-0"
              >
                Spara
              </button>
              <button
                type="button"
                onClick={() => setFavModalOpen(false)}
                className="px-2.5 py-1.5 text-brand-ink/50 hover:text-brand-ink font-mono text-xs shrink-0"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setNewFavName(activityText ? `${activityText.slice(0, 20)}...` : "Min favorit");
                setFavModalOpen(true);
              }}
              className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300/80 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Star size={13} className="text-amber-700 fill-amber-500" />
              <span>Spara som personlig favorit</span>
            </button>
          )}
        </div>

        {/* MANDATORY CONSENT CHECKBOX */}
        <div className="pt-3 border-t border-brand-ink/10">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={consentConfirmed}
              onChange={e => setConsentConfirmed(e.target.checked)}
              className="mt-0.5 rounded border-brand-ink/30 text-brand-accent focus:ring-0 w-4 h-4 cursor-pointer shrink-0"
            />
            <span className="text-xs text-brand-ink/80 font-light leading-relaxed group-hover:text-brand-ink">
              Jag bekräftar att jag inte delar andras personuppgifter (som namn, kontaktinfo, etc) i inbjudan utan deras uttryckliga godkännande. Jag förstår att min inbjudan granskas innan publicering.
            </span>
          </label>
        </div>

        {/* PUBLISH BUTTON */}
        <button
          type="button"
          onClick={handleAttemptPublish}
          disabled={!isFormValid || sending}
          className="w-full py-4 bg-brand-accent hover:bg-brand-accent/90 text-white font-mono text-xs uppercase tracking-wider rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
        >
          {sending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Publicerar på anslagstavlan...</span>
            </>
          ) : (
            <>
              <Send size={16} className="text-white" />
              <span>Publicera på anslagstavlan</span>
            </>
          )}
        </button>

        {/* SMS / QR GATEWAY SECTION (EXACT 3 LINES REQUIRED) */}
        <div className="pt-6 border-t border-brand-ink/10 space-y-3 text-center">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs uppercase font-semibold text-brand-ink">
              Eller skicka via SMS / QR (Gateway {gatewayNumber})
            </p>
            <button
              type="button"
              onClick={() => setShowQrSection(!showQrSection)}
              className="text-xs font-mono text-brand-accent hover:underline cursor-pointer font-medium"
            >
              {showQrSection || isFormValid ? "Dölj QR/SMS-väg" : "Visa QR/SMS-väg"}
            </button>
          </div>

          {(isFormValid || showQrSection) && (
            <div className="pt-2 animate-in fade-in duration-200">
              {isMobile ? (
                <a
                  href={smsHref}
                  className="w-full py-3.5 bg-brand-paper hover:bg-brand-paper/80 border border-brand-ink/10 text-brand-ink font-mono text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Send size={14} className="text-brand-accent" />
                  <span>Öppna SMS-app för insändning till {gatewayNumber}</span>
                </a>
              ) : (
                <div className="p-4 bg-brand-paper/30 rounded-2xl border border-brand-ink/5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <img src={qrUrl} alt="SMS QR Code" className="w-28 h-28 rounded-xl border border-brand-ink/10 shrink-0 bg-white p-1" />
                  <div className="space-y-1.5">
                    <span className="font-mono text-xs uppercase font-semibold text-brand-ink block">
                      Skanna med din mobiltelefon
                    </span>
                    <p className="text-xs text-brand-ink/75 leading-relaxed font-light">
                      QR-Koden öppnar din SMS-app med din inbjudan i ett färdigt SMS till numret {gatewayNumber}. När du skickar detta SMS kommer din inbjudan kunna granskas manuellt och sen publiceras.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI FLAGGED CONTENT MODAL */}
      {aiFlagModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 border border-brand-ink/10 shadow-2xl animate-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle size={24} className="shrink-0" />
              <h3 className="font-serif italic text-xl font-medium text-brand-ink">
                Granskning av inbjudan
              </h3>
            </div>

            <p className="text-xs text-brand-ink/80 leading-relaxed font-light">
              {aiFlagModal.message}
            </p>

            <p className="text-xs text-brand-ink/60 italic">
              Vill du justera din inbjudan innan den skickas vidare till en mänsklig granskare?
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAiFlagModal({ open: false, message: "" })}
                className="w-full sm:flex-1 py-3 bg-brand-paper hover:bg-brand-ink/10 text-brand-ink font-mono text-xs uppercase tracking-wider rounded-xl transition-colors font-semibold"
              >
                Justera inbjudan
              </button>
              <button
                type="button"
                onClick={executePublish}
                className="w-full sm:flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-colors font-semibold"
              >
                Skicka till granskning ändå
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
