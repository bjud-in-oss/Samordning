// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

export interface PwaServiceConfig {
  manifestUrl: string;
  swUrl: string;
}

export function registerServiceWorker(swPath: string = "/sw.js") {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(swPath)
        .then((reg) => {
          console.log("Service Worker registrerad för Android/PWA:", reg.scope);
        })
        .catch((err) => {
          console.error("Registrering av Service Worker misslyckades:", err);
        });
    });
  }
}

export function isStandaloneApp(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}
