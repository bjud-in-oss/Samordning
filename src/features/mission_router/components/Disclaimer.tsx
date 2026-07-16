// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

import React from "react";
import { UiLanguage } from "../translations";

interface DisclaimerProps {
  uiLanguage: UiLanguage;
}

const DISCLAIMERS: Record<UiLanguage, string> = {
  sv: "Detta är en fristående, inofficiell tjänst utan sponsring från kyrkan. Alla dina anpassade val sparas endast lokalt i din webbläsare och tjänsten varken ser eller sparar dina personuppgifter för att värna om din integritet.",
  en: "Independent unofficial service, not sponsored by the Church. No personal data storage takes place. The system stores no history.",
  es: "Servicio independiente no oficial, no patrocinado por la Iglesia. No se realiza almacenamiento de datos personales. El sistema no guarda historial.",
  sw: "Huduma huru isiyo rasmi, haijafadhiliwa na Kanisa. Hakuna uhifadhi wa data ya kibinafsi unaofanyika. Mfumo hauhifadhi historia yoyote.",
  vi: "Dịch vụ độc lập không chính thức, không được tài trợ bởi Giáo hội. Không lưu trữ dữ liệu cá nhân. Hệ thống không lưu trữ lịch sử."
};

export default function Disclaimer({ uiLanguage }: DisclaimerProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8 text-center text-brand-ink/40">
      <p className="text-[10px] leading-relaxed font-mono uppercase tracking-wider">
        {DISCLAIMERS[uiLanguage]}
      </p>
    </div>
  );
}
