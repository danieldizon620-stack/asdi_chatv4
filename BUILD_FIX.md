ASDI Messenger v5.1 GitHub Actions build fix

The original installer failed because electron-builder attempted GitHub publishing without GH_TOKEN. This project disables publishing.

Upload all project files to the repository (including .github/workflows). Open Actions > Build ASDI Messenger Windows Installer > Run workflow. After success download ASDI-Messenger-Windows-Setup artifact.

No GitHub token is needed to build. The installer is unsigned and may show Windows SmartScreen warning.
