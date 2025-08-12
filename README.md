## PixelPal — LinkedIn Post Saver (Chrome Extension)

### What it does
PixelPal lets you save LinkedIn posts as you browse, add notes, tags, and organize them into collections. View, search, and manage your saved posts in the extension’s Options page.

### Key features
- **Save posts in-place**: A “Save Post” button is injected into LinkedIn posts and post pages.
- **Notes, tags, collections**: Add context and organize your saves.
- **Saved Posts view**: Search, filter by collection, open the original post, or delete.

### Permissions used
- **tabs** and **scripting**: to inject the UI into LinkedIn pages.
- **storage**: to store saved posts, tags, collections, and onboarding state.
- Host permissions: `https://www.linkedin.com/*` (to run on LinkedIn), and `https://api.emailjs.com/*` (for optional email events).

### Install (from source)
1. Node 18+ recommended. Install dependencies:
   - `npm install`
2. Build the React assets (generates `asset-manifest.json` used for injection):
   - `npm run build`
3. Package and load the extension:
   - For a local test, load an unpacked folder that contains `manifest.json`, `background.js`, and the built assets (see `build.sh` for an example packaging flow).
   - In Chrome: go to `chrome://extensions` → enable Developer mode → Load unpacked → select the packaged folder.

### Usage
- Open LinkedIn. You’ll see a small PixelPal button on posts; click it to save.
- Click the PixelPal icon in Chrome and choose “Saved Posts” (or open the Options page) to browse, search, and manage your collection.
