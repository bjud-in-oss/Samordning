export const ORGANIZATIONS = [
  "Missionärerna",
  "Församlingsmissionen",
  "Biskopsrådet",
  "Äldstekvorumet",
  "Hjälpföreningen",
  "Unga Män (UM)",
  "Unga Kvinnor (UK)",
  "Primär",
  "Söndagsskolan",
  "Aktivitetskommittén",
  "Unga vuxna (UV)",
  "Ensamstående vuxna (EV)",
  "Institutet",
  "Seminariet",
  "Staven"
];

export const ORG_INFO: Record<string, string> = {
  "Missionärerna": "Heltidsmissionärer verksamma i området.",
  "Församlingsmissionen": "Lokalt samordnad medlemsmission.",
  "Biskopsrådet": "Ledarskapets officiella kallelser.",
  "Äldstekvorumet": "Vuxna bröder med fokus på stöd & tjänande.",
  "Hjälpföreningen": "Vuxna systrar med fokus på omsorg & gemenskap.",
  "Unga Män (UM)": "Ungdomsverksamhet för unga män (12-18 år).",
  "Unga Kvinnor (UK)": "Ungdomsverksamhet för unga kvinnor (12-18 år).",
  "Primär": "Barnverksamhet (upp till 11 år).",
  "Söndagsskolan": "Söndagens undervisningsverksamhet.",
  "Aktivitetskommittén": "Församlingens gemensamma fester och sociala aktiviteter.",
  "Unga vuxna (UV)": "Gemenskap för ensamstående vuxna i åldern 18-30 år.",
  "Ensamstående vuxna (EV)": "Gemenskap för ensamstående vuxna över 30 år.",
  "Institutet": "Religionsundervisning för unga vuxna.",
  "Seminariet": "Daglig religionsundervisning för tonåringar.",
  "Staven": "Regional ledning och regionala aktiviteter."
};

export const getHiddenOrgsForGroup = (primaryOrg: string): string[] => {
  if (primaryOrg === "Äldstekvorum (Män)") {
    return ["Hjälpföreningen", "Unga Kvinnor (UK)", "Primär", "Ensamstående vuxna (EV)", "Institutet"];
  }
  if (primaryOrg === "Hjälpförening (Kvinnor)") {
    return ["Äldstekvorumet", "Unga Män (UM)", "Primär", "Ensamstående vuxna (EV)", "Institutet"];
  }
  if (primaryOrg === "Unga Män (Ungdomar)" || primaryOrg === "Unga Kvinnor (Ungdomar)") {
    return ["Äldstekvorumet", "Hjälpföreningen", "Ensamstående vuxna (EV)", "Unga vuxna (UV)", "Institutet", "Primär"];
  }
  return [];
};
