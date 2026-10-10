with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

drawer_html = """
  <!-- MOBILE DRAWER OVERLAY -->
  <div id="mobile-drawer-overlay" class="mobile-drawer-overlay"></div>
  <!-- MOBILE SIDE DRAWER -->
  <div id="mobile-drawer" class="mobile-drawer" role="dialog" aria-label="Navigation menu">
    <div class="mobile-drawer-header">
      <img src="./assets/real_choco_loco_logo_gold.png" alt="Choco Loco" class="drawer-logo" />
      <button class="mobile-drawer-close" id="drawer-close-btn" aria-label="Close menu">
        <svg class="svg-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
    </div>
    <nav class="mobile-drawer-nav">
      <a href="#home" class="drawer-link active" data-target="home"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>Home</a>
      <a href="#menu" class="drawer-link" data-target="menu"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>Menu</a>
      <a href="#studio" class="drawer-link" data-target="studio"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>Studio</a>
      <a href="#boutique" class="drawer-link" data-target="boutique"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm0 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>Boutique</a>
      <a href="#lounge" class="drawer-link" data-target="lounge"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/></svg>Lounge</a>
      <a href="#bookings" class="drawer-link" data-target="bookings"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>Bookings</a>
      <a href="#catering" class="drawer-link" data-target="catering"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-2.26-2.71-3.59-6.17-3.59S4.69 12.73 4.69 14.99v1H16.03v-1z"/></svg>Catering</a>
      <a href="#about" class="drawer-link" data-target="about"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>About</a>
      <a href="#location" class="drawer-link" data-target="location"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>Location</a>
    </nav>
    <div class="mobile-drawer-footer">
      <a href="tel:+2204000060" class="drawer-cta-btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z"/></svg>+220 400 0060</a>
      <a href="https://wa.me/2204000060" target="_blank" rel="noopener" class="drawer-cta-btn drawer-wa-btn"><svg class="svg-icon" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.585 1.961.948 2.791.948 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.734-5.768-5.734zm9.969 5.766c0 5.518-4.482 10-10 10-1.745 0-3.385-.45-4.821-1.242l-5.179 1.355 1.381-5.048c-.896-1.492-1.381-3.218-1.381-5.065 0-5.518 4.482-10 10-10 5.518 0 10 4.482 10 10z"/></svg>WhatsApp Order</a>
    </div>
  </div>"""

marker = "  </nav>\n\n  <!-- HERO SECTION -->"
if marker in content:
    content = content.replace(marker, "  </nav>" + drawer_html + "\n\n  <!-- HERO SECTION -->", 1)
    print("Drawer inserted!")
else:
    print("Marker not found, trying alternative...")
    idx = content.find("</nav>")
    while idx != -1:
        next_chunk = content[idx:idx+50]
        print(f"Found </nav> at {idx}: {repr(next_chunk)}")
        idx = content.find("</nav>", idx+1)
        if idx > 5000: break

print("Has drawer:", "mobile-drawer-overlay" in content)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)
print("SAVED")
