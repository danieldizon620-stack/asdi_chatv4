ASDI Messenger v3.10 - Android + server source

Messenger-inspired Chats home screen, searchable employees, avatars, unread direct chat counts,
group and private conversations, mobile chat bubbles, back navigation and Logout.
Group chat retains existing reply/copy/delete, emoji, attachment and (+) menu.
Existing ticket and group-chat notifications poll while app is active.

SERVER INSTALL (required): Back up database and PHP files first.
Copy server/messenger.php, server/direct_chat.php, server/direct_chat_data.php,
and server/group_chat_widget.php into the ASDI ticketing root.
Keep the existing config/app.php, chat_window.php and group_chat.php.

BUILD APK: Upload Android project to GitHub and run .github/workflows/build_apk.yml.
This ZIP contains source code, not a compiled APK. Android build/device tests not run.
To upgrade over an installed APK, sign with the same key. Different debug keys cause package conflicts.
The Messenger-style interface is not a full Facebook Messenger clone: no voice/video calling,
end-to-end encryption, or direct-chat file sharing. No reliable closed-app push notifications.
