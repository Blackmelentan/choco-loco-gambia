# Choco Loco Patisserie · Café · Lounge

> Official Website, Interactive Digital Menu, Custom Dessert Studio, Retail Boutique and Admin PWA  
> Location: Junction Opposite Pipeline Mosque, Blue Building, Kairaba Avenue, Serekunda, The Gambia  
> Official Instagram: [@chocoloco_gmb](https://www.instagram.com/chocoloco_gmb/) | Direct Phone / WhatsApp: +220 400 0060

***

## Overview and Transformation Summary

This project delivers a responsive digital web application for Choco Loco The Gambia, tailored specifically to their brand identity, physical lounge experience, and social presence:

1. Authentic Brand Identity:
   * Replaced generic placeholder logos with the official dripping Choco Loco signature logo (`real_choco_loco_logo.png`).
   * Integrated real photos from their Pipeline patisserie: the glass pastry and cake display counter (featured on My Gambia), the outdoor terrace lounge, freshly scooped homemade gelato, and their famous "Brownies to Die For".

2. Lively, Appetizing Color Palette and Ambient Animations:
   * Eliminated the flat, gloomy dark background in favor of a warm, luxurious aesthetic: rich roasted cacao mahogany, golden honey amber, warm cream froth, and dynamic floating gold/cocoa particle micro-animations via HTML5 canvas.

3. Interactive "Build Your Own" Dessert Studio:
   * Modeled after Choco Loco in-store customization concept.
   * Customers can visually select a base (Bubble Waffle, French Crepe, Brownie, Dutch Mini-Pancakes), choose warm Belgian chocolate glazes (Milk, 70% Dark Ganache, White Velvet, Lotus Biscoff, Pistachio Cream), select artisanal toppings, and add gelato scoops.
   * Features real-time price tallying in Gambian Dalasi (`GMD`) and a 1-click WhatsApp Direct Order generator with their exact recipe pre-filled.

4. Boutique Retail and Take-Home Products Showcase:
   * Highlights packaged items available at the counter:
     * Pistachio Royale Spread (250g Jar) : 350 GMD
     * Rich Chocolate Hazelnut Cream (250g Jar) : 320 GMD
     * Executive Belgian Praline Gift Box (12 Pieces) : 650 GMD
     * Custom Artisan Celebration Cakes (Pre-Order) : From 1,800 GMD

5. Accurate Local Store Hours and Schedule:
   * Reflects the true schedule: Monday to Tuesday and Thursday to Saturday (7:00 AM to 11:00 PM), Sunday (8:00 AM to 11:00 PM), and Wednesday: CLOSED.
   * Built-in real-time GMT/UTC+0 clock that dynamically displays OPEN NOW, CLOSING SOON, or CLOSED WEDNESDAY.

6. PWA Admin Portal with Supabase Cloud Sync and Resilient Local Fallback:
   * Progressive Web App (PWA): When staff or management log in (Demo PIN: 2026), a dedicated install prompt allows 1-tap installation onto smartphones and desktops as a standalone app.
   * Live Stock Management: Toggle items in or out of stock with immediate frontend reflection.
   * Supabase Cloud Sync: Connect to Supabase via REST API, or seamlessly operate on local offline storage if unconfigured or without connectivity.

***

## GitHub Repository and GitHub Pages Deployment Guide

Follow these steps to deploy this project to GitHub and obtain a shareable live link for the business owners and stakeholders to test on their mobile phones and desktops.

### Step 1: Initialize Git and Commit Changes
In your local terminal (root directory of the project):

```bash
git init
git add .
git commit -m "feat: complete Choco Loco transformation with real logo, menu, studio, PWA and Supabase fallback"
```

### Step 2: Link Remote Repository on GitHub

```bash
git remote add origin https://github.com/Blackmelentan/choco-loco-gambia.git
git branch -M main
git push -u origin main
```

### Step 3: Build and Deploy to GitHub Pages

#### Option A: Quick Static Deployment (Vite Dist Branch)

```bash
cd frontend
npm run build
npx gh-pages -d dist
```

#### Option B: Automated GitHub Actions

A GitHub Actions workflow automatically builds `frontend/dist` and deploys to GitHub Pages upon pushing to `main`.

### Step 4: Live URL
GitHub Pages URL format:
```
https://blackmelentan.github.io/choco-loco-gambia/
```

***

## Admin PWA (Progressive Web App) Usage

1. Accessing Admin:
   * Scroll to the footer or navigation and click "Staff and Admin Access".
   * Enter the security PIN: `2026` (Demo PIN).
2. Installing the App:
   * Once authenticated, click "Install PWA App".
   * The browser prompt will install "Choco Admin" with the official logo directly to the mobile home screen or desktop launcher.
3. Features in Admin:
   * Update top announcement bar text.
   * Update store phone and WhatsApp order line.
   * Live Menu and Retail inventory stock toggles.
   * Test Supabase Cloud connection or monitor Local Fallback status.

***

## Business Information and Credits

* Establishment: Choco Loco Patisserie · Café · Lounge
* Location: Junction Opposite Pipeline Mosque, Blue Building, Kairaba Avenue, Serekunda, The Gambia
* Phone: +220 400 0060
* Instagram: [@chocoloco_gmb](https://www.instagram.com/chocoloco_gmb/)
* Photography Credits: Store interior and display counter photography courtesy of My Gambia and Choco Loco official archives.
