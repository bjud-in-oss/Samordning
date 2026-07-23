// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/mission_router/4_Produce] - Silent Render Ping Added

export interface PwaServiceConfig {
  manifestUrl: string;
  swUrl: string;
}

/**
  * Silent Render Ping to keep or wake up the backend on Render
  * when the PWA is launched on Netlify or mobile device.
  */
export async function pingRenderBackend(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    await fetch("/api/health", { method: "GET", cache: "no-store" });
    console.debug("[PWA] Silent Render Ping executed successfully.");
  } catch (err) {
    // Silent fail in background to avoid disrupting user experience
    console.debug("[PWA] Silent Render Ping background status:", err);
  }
}

export function registerServiceWorker(swPath: string = "/sw.js"): Promise<ServiceWorkerRegistration | null> {

  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    return navigator.serviceWorker
      .register(swPath, { scope: "/" })
      .then((reg) => {
        console.log("Service Worker registrerad för Android/PWA:", reg.scope);
        return reg;
      })
      .catch((err) => {
        console.error("Registrering av Service Worker misslyckades:", err);
        return null;
      });
  }
  return Promise.resolve(null);
}

export async function getActiveServiceWorkerRegistration(swPath: string = "/sw.js"): Promise<ServiceWorkerRegistration> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    throw new Error("Service Worker stöds inte i denna enhet eller webbläsare.");
  }

  // Ensure registration is triggered
  await registerServiceWorker(swPath);

  // ALWAYS wait for navigator.serviceWorker.ready
  const registration = await navigator.serviceWorker.ready;

  // Ensure registration has an active service worker state
  if (!registration.active) {
    const worker = registration.installing || registration.waiting;
    if (worker) {
      await new Promise<void>((resolve) => {
        const handleStateChange = () => {
          if (worker.state === "activated" || registration.active) {
            worker.removeEventListener("statechange", handleStateChange);
            resolve();
          }
        };
        worker.addEventListener("statechange", handleStateChange);
      });
    }
  }

  if (!registration.active) {
    throw new Error("Subscription failed - no active Service Worker");
  }

  return registration;
}

export async function subscribeUserToPush(publicKey: string, swPath: string = "/sw.js"): Promise<PushSubscription> {
  const registration = await getActiveServiceWorkerRegistration(swPath);

  if (!registration.active) {
    throw new Error("Subscription failed - no active Service Worker");
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  });

  return subscription;
}

export function isStandaloneApp(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
