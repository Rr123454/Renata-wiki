# Editing Renata Wiki in Codespaces

This project is a static website: its pages are HTML files, its styles are in `css/`, its site behavior and written content are mostly in `js/`, and images belong in `assets/`.

## Start your cloud workspace

1. On GitHub, open the **codex/codespaces-setup** branch.
2. Select **Code** → **Codespaces** → **Create codespace on codex/codespaces-setup**.
3. If GitHub asks you to enable or choose a billing plan, follow its prompts. Choose the smallest available machine; this website needs very little computing power.
4. Wait for the browser editor to open. The website preview starts automatically. If it does not appear, open the **Ports** tab and select the globe icon next to port **8000**.

The preview is private to your GitHub account. It is not the public website, and starting it does not deploy anything.

## Make edits with plain English

You can ask GitHub Copilot Chat in the editor, or ask Codex in this conversation. Examples:

- "Change the headline on the home page to … and keep the existing style."
- "Add a team member called … with this biography."
- "Make the navigation easier to read on phones."
- "Add this image to the project-description page with alt text describing it."
- "Show me a preview and explain what files you changed."

Copilot Chat may ask you to sign in or enable a paid/free Copilot plan; that is a GitHub account decision only you can authorize. Codex can still help you through this conversation without it.

## Add your own images

1. Drag an image from your computer into the `assets/` folder in the file explorer.
2. Use a short lowercase filename, such as `team-lab-photo.jpg`.
3. Ask Copilot or Codex to place it on the desired page and add useful alternative text for visitors who use screen readers.
4. Check the port 8000 preview before saving or sharing the change.

## Keep changes safe

Work in a new branch for each meaningful website change. Preview first, then commit your changes to that branch. Create a pull request only when you are ready for review. Never merge a pull request into `main` or deploy the site until you have explicitly decided to do so.
