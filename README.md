# ASDI Android v3.31 — Chatroom only, phone responsive

**Android Studio/Gradle source project, not a compiled APK.**

## Changes
- After login, the PHP site often redirects to `index.php`. The app now intercepts that dashboard navigation at page start, before rendering, and loads `chatroom.php` without relying on fragile header selectors.
- Dashboard, ticketing menu, Tools tab, top navigation and chat tabs are hidden in the Android WebView. Group/Users panels and their collapse controls remain.
- Chatroom occupies the phone viewport and adjusts to narrow phones; improved text and UI contrast.
- Login page is still shown when signed out.
- Existing new-ticket and chat alert polling remain available while the app is active.

## Build
1. Upload the Android project to GitHub.
2. Run the workflow in `.github/workflows/build_apk.yml`.
3. Download and install the resulting APK. Signing certificate must match existing app for an in-place update.

## Limitations
The app has not been compiled or tested on a phone in this environment. Actual layout depends on the PHP server's current HTML/CSS; if it differs from the included ASDI v3.30 source, some selectors may need adjustment. Alerts still require the server's mobile notification PHP endpoints and do not provide background push.
