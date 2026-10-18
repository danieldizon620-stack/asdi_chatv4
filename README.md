# ASDI_Ticketing Windows Messenger v5.2

A separate Electron-based chatroom-only desktop application.

## Features
- Opens the configured ASDI Ticketing chatroom URL; existing server login is used.
- Editable server URL: Application > Server Settings (Ctrl+,). Settings are stored per Windows user.
- After changing server URL, Save & Connect opens the chatroom on the new server.
- New-message taskbar overlay dot, Windows notification, and beep when the app is running, not focused, and the server chat_notifications.php endpoint reports new activity.
- Product name, installer, and shortcuts renamed ASDI_Ticketing.

## Build
1. Upload these project files (including .github) to GitHub.
2. Actions > Build ASDI_Ticketing Windows Installer > Run workflow.
3. Download the ASDI-Ticketing-Windows-Setup artifact.
4. Run ASDI_Ticketing_Setup_5.2.0.exe and pin the installed application to the taskbar.

## Important
- The Windows installer is built by GitHub Actions; this ZIP is source, not a compiled EXE.
- The server must be accessible from each Windows PC.
- The app uses the server's existing login and chatroom pages. If the server redirects to an unexpected page, a server-side login redirect may need adjustment.
- Notifications require the existing chat_notifications.php endpoint and the app to be running. Group activity is counted by changed latest-message IDs; not guaranteed to represent each individual unread message.
- The app does not verify TLS certificates for HTTP servers because HTTP has no TLS. Prefer HTTPS for credentials on untrusted networks.
