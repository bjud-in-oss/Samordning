// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React from "react";
import { UiLanguage } from "../translations";

interface DisclaimerProps {
  uiLanguage: UiLanguage;
}

const DISCLAIMERS: Record<UiLanguage, string> = {
  sv: "Fristående inofficiell tjänst, ej sponsrad av kyrkan. Ingen lagring av personuppgifter sker. Systemet sparar ingen historik.",
  en: "Independent unofficial service, not sponsored by the Church. No personal data storage takes place. The system stores no history.",
  es: "Servicio independiente no oficial, no patrocinado por la Iglesia. No se realiza almacenamiento de datos personales. El sistema no guarda historial.",
  sw: "Huduma huru isiyo rasmi, haijafadhiliwa na Kanisa. Hakuna uhifadhi wa data ya kibinafsi unaofanyika. Mfumo hauhifadhi historia yoyote.",
  vi: "Dịch vụ độc lập không chính thức, không được tài trợ bởi Giáo hội. Không lưu trữ dữ liệu cá nhân. Hệ thống không lưu trữ lịch sử."
};

export default function Disclaimer({ uiLanguage }: DisclaimerProps) {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 flex items-center justify-center py-4 px-6 shrink-0 text-slate-400 text-center">
      <p className="text-xs md:text-sm">
        {DISCLAIMERS[uiLanguage]}
      </p>
    </footer>
  );
}
