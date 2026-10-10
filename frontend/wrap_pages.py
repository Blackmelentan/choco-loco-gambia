with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# The strategy: wrap logical groupings of sections into data-page divs.
# Home page = hero + stats-banner
# Menu page = #menu
# Studio page = #custom-studio
# Boutique page = #retail-products
# Lounge page = #gallery + #table-qr
# Bookings page = #bookings
# Catering page = #catering
# About page = #about
# Location page = #location
# Footer stays outside all pages

# Step 1: Wrap hero section + stats-banner in home page div
content = content.replace(
    '  <!-- HERO SECTION -->',
    '  <!-- PAGE: HOME -->\n  <div data-page="home" class="page-view active">\n  <!-- HERO SECTION -->'
)

# After stats-banner close div (</div> after stats-grid</div></div>)
# Find the end of stats-banner
stats_end = '  </div>\n\n  <!-- ABOUT US / OUR STORY -->'
if stats_end in content:
    content = content.replace(stats_end, '  </div>\n  </div><!-- end page:home -->\n\n  <!-- PAGE: ABOUT -->\n  <div data-page="about" class="page-view">\n  <!-- ABOUT US / OUR STORY -->', 1)
    print('home+about wrap ok')
else:
    print('WARNING: stats_end not found')

# After about section, wrap menu
about_to_menu = '  </section>\n\n  <!-- DESSERT MENU'
if about_to_menu in content:
    content = content.replace(about_to_menu, '  </section>\n  </div><!-- end page:about -->\n\n  <!-- PAGE: MENU -->\n  <div data-page="menu" class="page-view">\n  <!-- DESSERT MENU', 1)
    print('about+menu wrap ok')
else:
    print('WARNING: about_to_menu not found, trying alternative...')
    # Find any transition from about to menu
    import re
    m = re.search(r'(</section>\s*\n\s*<!-- [^>]+ MENU)', content)
    if m:
        print('Found menu at:', m.start(), repr(content[m.start():m.start()+80]))

# After menu section ends, wrap studio
menu_to_studio = '  </section>\n\n  <!-- CUSTOM DESSERT STUDIO'
if menu_to_studio in content:
    content = content.replace(menu_to_studio, '  </section>\n  </div><!-- end page:menu -->\n\n  <!-- PAGE: STUDIO -->\n  <div data-page="studio" class="page-view">\n  <!-- CUSTOM DESSERT STUDIO', 1)
    print('menu+studio wrap ok')
else:
    print('WARNING: menu_to_studio not found')

# After studio, wrap boutique
studio_to_boutique = '  </section>\n\n  <!-- RETAIL PRODUCTS'
if studio_to_boutique in content:
    content = content.replace(studio_to_boutique, '  </section>\n  </div><!-- end page:studio -->\n\n  <!-- PAGE: BOUTIQUE -->\n  <div data-page="boutique" class="page-view">\n  <!-- RETAIL PRODUCTS', 1)
    print('studio+boutique wrap ok')
else:
    print('WARNING: studio_to_boutique not found')

# After boutique, wrap lounge (gallery + table-qr)
boutique_to_lounge = '  </section>\n\n  <!-- LOUNGE GALLERY'
if boutique_to_lounge in content:
    content = content.replace(boutique_to_lounge, '  </section>\n  </div><!-- end page:boutique -->\n\n  <!-- PAGE: LOUNGE -->\n  <div data-page="lounge" class="page-view">\n  <!-- LOUNGE GALLERY', 1)
    print('boutique+lounge wrap ok')
else:
    print('WARNING: boutique_to_lounge not found')

# After table-qr (inside lounge), wrap bookings
lounge_to_bookings = '  </section>\n\n  <!-- TABLE RESERVATIONS'
if lounge_to_bookings in content:
    # table-qr section then bookings
    pass  # table-qr is part of lounge page

# Find end of table-qr then transition to bookings
qr_to_bookings = '  </section>\n\n  <!-- BOOKINGS'
if qr_to_bookings in content:
    content = content.replace(qr_to_bookings, '  </section>\n  </div><!-- end page:lounge -->\n\n  <!-- PAGE: BOOKINGS -->\n  <div data-page="bookings" class="page-view">\n  <!-- BOOKINGS', 1)
    print('lounge+bookings wrap ok')
else:
    print('WARNING: qr_to_bookings not found')

# After bookings, wrap catering
bookings_to_catering = '  </section>\n\n  <!-- CATERING'
if bookings_to_catering in content:
    content = content.replace(bookings_to_catering, '  </section>\n  </div><!-- end page:bookings -->\n\n  <!-- PAGE: CATERING -->\n  <div data-page="catering" class="page-view">\n  <!-- CATERING', 1)
    print('bookings+catering wrap ok')
else:
    print('WARNING: bookings_to_catering not found')

# After catering, wrap location
catering_to_location = '  </section>\n\n  <!-- LOCATION'
if catering_to_location in content:
    content = content.replace(catering_to_location, '  </section>\n  </div><!-- end page:catering -->\n\n  <!-- PAGE: LOCATION -->\n  <div data-page="location" class="page-view">\n  <!-- LOCATION', 1)
    print('catering+location wrap ok')
else:
    print('WARNING: catering_to_location not found')

# Close location page before admin modal
location_to_admin = '  </section>\n\n  <!-- ADMIN'
if location_to_admin in content:
    content = content.replace(location_to_admin, '  </section>\n  </div><!-- end page:location -->\n\n  <!-- ADMIN', 1)
    print('location close ok')
else:
    print('WARNING: location_to_admin not found')

print()
print('Final page-view count:', content.count('data-page='))
print('Has page-view class:', 'page-view' in content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('SAVED')
