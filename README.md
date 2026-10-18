# ASDI_Ticketing Windows Messenger v5.3

## New startup behavior
- Always shows Server Settings on startup. No automatic server connection.
- Enter or edit the server URL and click **Save & Connect**. The previously saved address is shown for convenience.
- The app then opens the server chatroom-only page; existing login remains managed by the ASDI server.
- To change servers while connected, select **Application > Server Settings** (Ctrl+,).
- The chatroom notification overlay, desktop notification, and sound logic are retained from v5.2 and require the server chat_notifications.php endpoint.

## Build installer
1. Upload all files, including the .github directory, to the root of your GitHub repository.
2. Go to Actions > Build ASDI_Ticketing Windows Installer > Run workflow.
3. Download the ASDI-Ticketing-Windows-Setup artifact and run the installer.

This is source code, not a compiled installer. It has not been tested on a Windows computer.
