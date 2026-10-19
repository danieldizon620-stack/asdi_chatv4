# ASDI Android v3.29 — Fullscreen Chatroom

**Android source project (not a compiled APK).**

## Changes
- Login through ASDI, then open `chatroom.php` full-screen, without main website navigation or Chatroom/Messages menu tabs.
- The application menu retains Logout.
- New ticket notifications include ticket fields in expanded Android notifications.
- Red in-app unread chat badge, with notification count (launcher dots depend on Android launcher/notification settings).
- Group and private chat notification summaries exclude the user's own messages.
- Server URL fixed to `http://100.69.232.118:8080/asdi_ticketing/`.
- Photo attachments, emoji, and user status remain server-driven.

## Required server installation
Back up your ASDI Ticketing installation. Copy all three files from `server/` to your `asdi_ticketing/` root:
- `mobile_ticket_notifications.php`
- `mobile_chat_notifications.php`
- `mobile_logout.php`

These are additional PHP endpoints, not a System Upgrade ZIP. The server needs the current `tickets`, `direct_messages`, and `asdi_chat_messages` database schema.

## APK build
Upload Android project files to GitHub and run `.github/workflows/build_apk.yml`, then download its APK artifact. This ZIP is **not** an APK.
Existing app upgrades require the **same signing key** as the installed APK. VersionCode is 329.

## Notification limits
Chat and ticket alerts poll every 15 seconds **while the app is active**. No Firebase push or reliable notifications when the app is closed/backgrounded. Red badge inside the app is implemented; the launcher red dot/number is controlled by Android/launcher and may differ between phones. New-ticket details are displayed when returned by the server endpoint. On first successful poll, existing tickets/chats are used as a baseline and not alerted.
