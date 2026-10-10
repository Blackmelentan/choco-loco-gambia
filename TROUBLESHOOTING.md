# Choco Loco Website Troubleshooting Guide

This guide covers common issues and resolutions when deploying, developing, or running the **Choco Loco** web application and Admin PWA.

***

## 1. GitHub Pages Deployment and Asset Loading

### Symptom: Images, styles, or JavaScript return 404 on GitHub Pages
* **Root Cause**: When deploying to `https://<username>.github.io/<repo-name>/`, absolute paths like `/assets/logo.png` or `/style.css` resolve to `https://<username>.github.io/assets/logo.png`, which does not exist.
* **Solution**:
  1. We have configured `base: './'` in `frontend/vite.config.js`. This guarantees that Vite builds all asset references with relative paths (`./assets/...`).
  2. In `frontend/index.html`, all image sources and links use `./assets/...` and `./style.css`.
  3. If rebuilding manually, always execute `npm run build` from inside the `frontend/` directory and ensure you deploy the contents of `frontend/dist/`.

### Symptom: GitHub Pages shows a blank white screen or 404
* **Solution**:
  1. Go to your repository on GitHub -> **Settings** -> **Pages**.
  2. Check the **Source**:
     * If using a `gh-pages` branch, ensure the branch is selected and the folder is set to `/(root)`.
     * If using GitHub Actions, check the **Actions** tab to ensure the workflow succeeded without errors.
  3. Verify that `index.html` exists at the root of the published branch or artifact.

***

## 2. PWA (Progressive Web App) and Mobile Installation

### Symptom: "Install PWA App" button does not show a prompt
* **Root Cause**: Browsers enforce strict security and engagement criteria before triggering the `beforeinstallprompt` event:
  1. **HTTPS is Mandatory**: PWA installation will only function over `https://` (or `localhost` during local development).
  2. **Browser Support**:
     * **Google Chrome and Edge (Android and Desktop)**: Fully supports automatic install prompts via `beforeinstallprompt`.
     * **Apple Safari (iOS and iPadOS)**: Apple does not support the JavaScript `beforeinstallprompt` API.
* **How to Install on iOS (iPhone and iPad)**:
  1. Open the website in **Safari**.
  2. Tap the **Share** button (box with an arrow pointing up) at the bottom of the screen.
  3. Scroll down and tap **"Add to Home Screen"**.
  4. Tap **Add** in the top right corner. The Choco Loco dripping logo will appear on your home screen and open in standalone app mode!

### Symptom: Changes to code do not appear after deploying (stale cache)
* **Root Cause**: The Service Worker (`sw.js`) caches core application assets for instant offline loading.
* **Solution**:
  1. Increment the cache version name in `frontend/public/sw.js` (e.g. from `choco-loco-v2.1` to `choco-loco-v2.2`).
  2. In your browser Developer Tools (F12) -> **Application** -> **Service Workers** -> click **Unregister** or check **Update on reload**.
  3. In Chrome or Edge, perform a hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac).

***

## 3. Leaflet Map Display and Tiles

### Symptom: The location map tiles appear gray or misaligned
* **Root Cause**: Leaflet calculates tile grid positions based on the container element dimensions upon initialization. If initialized before the layout completes rendering, dimensions may be zero.
* **Solution**:
  * In `frontend/app.js`, map initialization is wrapped inside `DOMContentLoaded`.
  * If placing the map inside a tab or dynamic modal, invoke `map.invalidateSize()` after the container becomes visible.
  * Ensure the Leaflet CSS stylesheet (`https://unpkg.com/leaflet@1.9.4/dist/leaflet.css`) is loaded in the `<head>` before initializing the map.

***

## 4. Supabase Cloud Integration and Fallback Mode

### Symptom: Supabase reports a CORS error or Network Error
* **Root Cause**:
  1. The Supabase project URL may contain a trailing slash (e.g. `https://xyz.supabase.co/` instead of `https://xyz.supabase.co`).
  2. The Project API key entered is invalid or from a different project.
* **Solution**:
  * In the Admin Portal (**Staff and Admin Access** -> PIN `2026` -> **Supabase Cloud Sync** tab), ensure the URL is entered as:
    ```
    https://<project-ref>.supabase.co
    ```
  * Paste the **Anon public key** (found in your Supabase dashboard under Project Settings -> API).
  * Click **"Test Connection"** to verify that the endpoint responds.

### Symptom: "Local Resilient Fallback" remains active
* **Behavior**: If no Supabase credentials are configured, the app operates in **Zero-Config Resilient Local Mode**. All menu item stock toggles and settings are persisted in browser `localStorage`. No features are disabled and the website functions seamlessly for customers and staff.

***

## 5. WhatsApp Ordering Format

### Symptom: Clicking "Order via WhatsApp" says invalid phone number
* **Root Cause**: WhatsApp Click to Chat links require the international country code without plus signs (`+`), dashes, or spaces.
* **Solution**:
  * The Gambia country code is `220`.
  * Choco Loco direct desk number is `400 0060`.
  * The WhatsApp URL format is strictly formatted as:
    ```
    https://wa.me/2204000060?text=...
    ```
  * This is properly enforced in `DEFAULT_CONFIG.whatsappNumber = "2204000060"`.

***

## 6. Resetting Local Settings and Defaults

If test modifications were made in the Admin Portal and you wish to restore the factory default menu, products, and banner text:
1. Open the browser Developer Tools (F12).
2. Go to the **Console** tab.
3. Run:
   ```javascript
   localStorage.removeItem('choco_loco_config');
   localStorage.removeItem('choco_loco_menu');
   location.reload();
   ```
4. The page will reload with all authentic default settings restored.
