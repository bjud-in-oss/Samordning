# Last Cycle Log: `mission_router` & Global Client Boundary Fix

## Root Cause Analysis
The browser runtime error `util.inherits is not a function` occurred because Node.js-only backend dependencies (`web-push`, `fs`, `path`) in `src/features/mission_router/domain/pushService.ts` were re-exported through the public API barrier `src/features/mission_router/index.ts`. When client React components imported items from `src/features/mission_router`, Vite bundled `pushService.ts` into the browser bundle, dragging in Node's `web-push` module which references `util.inherits`.

## Applied Resolution
1. **Public API Barrier Isolation**: Removed `export * from "./domain/pushService";` from `src/features/mission_router/index.ts`. Server-side endpoints in `server.ts` continue to import `pushService.ts` directly via `./src/features/mission_router/domain/pushService`.
2. **Safe `localStorage` Parsing**: Added `try...catch` safeguards around `localStorage` parsing in `useInvitationFavorites.ts`, `ActiveStream.tsx`, and `App.tsx` to handle potential corrupt local data gracefully.
3. **Verification**: Executed type-checking (`tsc --noEmit`), compiled application build (`compile_applet`), and verified dev server execution (`restart_dev_server`).
