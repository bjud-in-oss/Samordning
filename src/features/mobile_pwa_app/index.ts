// [src/features/mobile_pwa_app/index.ts] - Public API Barrier

export {
  pingRenderBackend,
  registerServiceWorker,
  getActiveServiceWorkerRegistration,
  subscribeUserToPush,
  isStandaloneApp,
  urlBase64ToUint8Array
} from "./pwaService";
export type { PwaServiceConfig } from "./pwaService";
