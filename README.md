# ASDI Chatroom Android v3.28

Android WebView app for the current **ASDI Ticketing v3.27** server.

- Starts at `http://100.69.232.118:8080/asdi_ticketing/chatroom.php`
- Uses the server's Groups / Conversation / Users chatroom, including Online / Last Active / Offline statuses.
- Uses server-side group/private chat Reply, Copy, Forward, Delete; emoji stickers, attachments and group management.
- Android menu: Chatroom, Private messages, Logout.
- Attachment picker and camera option retained.
- Existing ticket and group message notification polling while app is open/active.
- No server settings screen. Server URL is hard-coded in MainActivity.java.
- Existing Android application ID retained: `com.asdi.chatroom`.
- Version: 3.28 (versionCode 328).

**IMPORTANT**: Server must already have ASDI Ticketing v3.27 (or newer) installed. Do not upload this Android source ZIP through System Upgrade.

## Build APK
1. Extract this ZIP.
2. Upload the project contents to a GitHub repository (including `.github/workflows`).
3. Run Actions > Build ASDI Chatroom v3.28 APK > Run workflow.
4. Download the `ASDI-Chatroom-v3.28-APK` artifact and install the `app-debug.apk`.

The project uses Android Gradle Plugin / Gradle configured in the repository.
The APK has **not been compiled or device-tested** in this environment.

## Existing app upgrade
To install over an existing ASDI APK, both builds must have the same application ID and **the same signing certificate**. GitHub Actions debug APKs can be signed with different debug keys on different runs; in that case Android reports a package conflict. Use your persistent release signing key for reliable upgrades. Uninstalling the old app can remove its local data.

## Notes
This is not a native Messenger clone; it displays your current PHP chatroom and uses its functions. No reliable background push is included; notifications are polled while the app is active.
