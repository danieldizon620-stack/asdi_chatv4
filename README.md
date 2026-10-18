# ASDI Messenger Windows Installer v5

A separate Windows Electron application that opens **chatroom.php** directly using the existing ASDI Ticketing login. The ticketing dashboard is not the landing page.

## Build a Windows Setup EXE using GitHub

1. Create a new GitHub repository or use your messenger repository.
2. Upload **all files and folders inside this package**, including the hidden `.github/workflows` directory, to the repository root.
3. Open **Actions > Build ASDI Messenger Windows Installer > Run workflow**.
4. Wait for a successful build, then download the `ASDI-Messenger-Windows-Setup` artifact.
5. Extract and run `ASDI_Messenger_Setup_5.0.0.exe` on Windows. Pin **ASDI Messenger** to the taskbar after installing.

Alternatively, on a Windows PC with Node.js 22 installed, run `npm install` then `npm run dist`.

## Behavior

- Opens `http://100.69.232.118:8080/asdi_ticketing/chatroom.php` directly; the PHP login page appears when a session is needed.
- Uses a dedicated persistent Electron browser session (not the user's normal Chrome/Edge login).
- Checks the existing authenticated `chat_notifications.php` endpoint every 5 seconds.
- When the app is not focused and the server reports new group messages, it shows a **native red taskbar overlay dot**, beeps, and shows a Windows toast where supported.
- Clears the taskbar dot when the app regains focus.
- New message detection is based on message ID advances per group and team chat; this is an **approximate alert**, not a true per-user unread count. Direct-message changes are not included in the supplied notification endpoint.
- Notifications only operate while the application is running (including minimized). It does not notify after the app is fully closed.
- Login redirects are handled by opening chatroom.php directly. If the server's login.php forcibly redirects to index.php after login, the app attempts to return to chatroom.php, but the original login.php was not in the uploaded archive; a server-side login change may still be needed.
- Server address is a private 100.69.x.x address. Windows PC must have access to that network (e.g. configured VPN/Tailscale).

## Notes

The uploaded ZIP contains no login.php, so server-side login behavior cannot be fully verified. This package does not change the ticketing database or any PHP files. The source is ready to build but no Windows executable has been compiled in this environment. Unsigned installers may trigger Windows SmartScreen warnings.
