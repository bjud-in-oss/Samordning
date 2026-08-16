// [src/features/skapa_inbjudan/components/PostSubmissionStepper.tsx] - 4-Step Post Submission Stepper

import React, { useState } from "react";
import { X } from "lucide-react";
import { AiReviewProposal } from "../domain/types";
import { GATEWAY_NUMBER } from "../domain/constants";
import { washAnnouncementText } from "../../mission_router";
import { Step1AiReview } from "./Step1AiReview";
import { Step2Privacy } from "./Step2Privacy";
import { Step3SmsShare } from "./Step3SmsShare";
import { Step4Reconciliation } from "./Step4Reconciliation";

interface PostSubmissionStepperProps {
  activityText: string;
  selectedTime: string;
  locationName: string;
  selectedOrganization: string;
  organizerPersonName: string;
  selectedAreas: string[];
  selectedAudience: string[];
  consentConfirmed: boolean;
  setConsentConfirmed: (val: boolean) => void;
  formattedText: string;
  aiProposal: AiReviewProposal;
  onClose: () => void;
  onSuccess: () => void;
}

export function PostSubmissionStepper({
  activityText,
  selectedTime,
  locationName,
  selectedOrganization,
  organizerPersonName,
  selectedAreas,
  selectedAudience,
  consentConfirmed,
  setConsentConfirmed,
  formattedText,
  aiProposal,
  onClose,
  onSuccess
}: PostSubmissionStepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const isMobile = typeof window !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);
  const smsBody = encodeURIComponent(`#WEBB\n${formattedText}`);
  const smsHref = `sms:${GATEWAY_NUMBER}?body=${smsBody}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(smsHref)}`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(`#WEBB\n${formattedText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadIcs = () => {
    const now = new Date();
    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };
    
    const startTime = new Date(now.getTime() + 2 * 3600 * 1000);
    const endTime = new Date(startTime.getTime() + 3600 * 1000);

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Ge Stod//NONSGML v1.0//SV",
      "BEGIN:VEVENT",
      `SUMMARY:${washAnnouncementText(activityText) || "Inbjudan"}`,
      `DESCRIPTION:${formattedText.replace(/\n/g, "\\n")}`,
      `LOCATION:${locationName || selectedAreas.join(", ") || "Göteborg"}`,
      `DTSTART:${formatICSDate(startTime)}`,
      `DTEND:${formatICSDate(endTime)}`,
      `STATUS:CONFIRMED`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "inbjudan.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmSent = async () => {
    setSaving(true);
    try {
      await fetch("/api/sim/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "0700000000",
          body: `#WEBB\n${formattedText}`
        })
      });

      const newProposal = {
        id: `prop-${Date.now()}`,
        category: selectedAudience[0] || "Vara en vän",
        area: selectedAreas.join(", ") || locationName || "Göteborg",
        locationName,
        time: selectedTime,
        scrubbedText: washAnnouncementText(activityText),
        responsibleParty: selectedOrganization + (organizerPersonName ? ` (${organizerPersonName})` : ""),
        createdAt: new Date().toISOString(),
        status: "pending"
      };

      if (typeof localStorage !== "undefined") {
        const stored = localStorage.getItem("my_pending_proposals");
        const list = stored ? JSON.parse(stored) : [];
        localStorage.setItem("my_pending_proposals", JSON.stringify([newProposal, ...list.filter((p: any) => p.id !== newProposal.id)]));
      }

      setIsSubmitted(true);
    } catch (e) {
      console.error("Fel vid sparande av inbjudan:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 text-left">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-brand-ink/10 space-y-5 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-ink/40 hover:text-brand-ink p-1 rounded-full cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-brand-ink/60">
            <span>Steg {currentStep} av 4</span>
            <span>
              {currentStep === 1 && "1. AI-rekonciliering"}
              {currentStep === 2 && "2. Integritet"}
              {currentStep === 3 && "3. SMS & QR-kod"}
              {currentStep === 4 && "4. SMS-returavstämning"}
            </span>
          </div>
          <div className="h-1.5 w-full bg-brand-paper rounded-full overflow-hidden flex">
            <div
              className="bg-brand-accent transition-all duration-300 h-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {currentStep === 1 && (
          <Step1AiReview
            aiProposal={aiProposal}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2Privacy
            consentConfirmed={consentConfirmed}
            setConsentConfirmed={setConsentConfirmed}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <Step3SmsShare
            isMobile={isMobile}
            smsHref={smsHref}
            qrUrl={qrUrl}
            copied={copied}
            onCopyText={handleCopyText}
            onNext={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 4 && (
          <Step4Reconciliation
            isSubmitted={isSubmitted}
            saving={saving}
            onConfirmSent={handleConfirmSent}
            onRetryStep3={() => setCurrentStep(3)}
            onDownloadIcs={downloadIcs}
            onSuccess={onSuccess}
          />
        )}
      </div>
    </div>
  );
}
