import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

print(f"Original length: {len(content)}")

content = content.replace(
    '<span class="pulse-dot"></span> OPEN NOW &middot; Closes 11:00 PM',
    '<span class="pulse-dot"></span><span class="status-open-label">OPEN NOW</span><span class="status-close-time"> &middot; Closes 11:00 PM</span>'
)
content = content.replace(
    'Welcome to Choco Loco : Artisan Belgian Callebaut chocolate, signature waffles and luxury patisserie in Pipeline!',
    'Artisan Belgian Callebaut chocolate, waffles and luxury patisserie in Pipeline!'
)
content = content.replace('<span id="announcement-text">', '<span id="announcement-text" class="announcement-text-desktop">')
content = content.replace('<!-- TOP ANNOUNCEMENT BAR (NO EMOJIS, NO DASHES) -->', '<!-- TOP ANNOUNCEMENT BAR COMPACT -->')
content = content.replace('instagram.com/chocoloco_gmb/" target="_blank" rel="noopener" class="top-contact-link">', 'instagram.com/chocoloco_gmb/" target="_blank" rel="noopener" class="top-contact-link top-ig-link">')
content = content.replace('<a href="#hero" class="nav-brand">', '<a href="#home" class="nav-brand" id="nav-brand-link">')

print("Has old nav?", "href=\"#hero\" class=\"active\">Home</a></li>" in content)
old_ul = "      <ul class=\"nav-links\">"
new_ul = "      <ul class=\"nav-links\" id=\"desktop-nav-links\">"
content = content.replace(old_ul, new_ul, 1)

old_li_home = "<li><a href=\"#hero\" class=\"active\">Home</a></li>"
new_li_home = "<li><a href=\"#home\" class=\"nav-link active\" data-target=\"home\">Home</a></li>"
content = content.replace(old_li_home, new_li_home, 1)

old_li_story = "<li><a href=\"#about\">Story</a></li>"
new_li_story = ""
content = content.replace(old_li_story, new_li_story, 1)

old_li_menu = "<li><a href=\"#menu\">Menu</a></li>"
new_li_menu = "<li><a href=\"#menu\" class=\"nav-link\" data-target=\"menu\">Menu</a></li>"
content = content.replace(old_li_menu, new_li_menu, 1)

old_li_studio = "<li><a href=\"#custom-studio\">Studio</a></li>"
new_li_studio = "<li><a href=\"#studio\" class=\"nav-link\" data-target=\"studio\">Studio</a></li>"
content = content.replace(old_li_studio, new_li_studio, 1)

old_li_boutique = "<li><a href=\"#retail-products\">Boutique</a></li>"
new_li_boutique = "<li><a href=\"#boutique\" class=\"nav-link\" data-target=\"boutique\">Boutique</a></li>"
content = content.replace(old_li_boutique, new_li_boutique, 1)

old_li_lounge = "<li><a href=\"#gallery\">Lounge</a></li>"
new_li_lounge = "<li><a href=\"#lounge\" class=\"nav-link\" data-target=\"lounge\">Lounge</a></li>"
content = content.replace(old_li_lounge, new_li_lounge, 1)

old_li_bookings = "<li><a href=\"#bookings\">Bookings</a></li>"
new_li_bookings = "<li><a href=\"#bookings\" class=\"nav-link\" data-target=\"bookings\">Bookings</a></li>"
content = content.replace(old_li_bookings, new_li_bookings, 1)

old_li_catering = "<li><a href=\"#catering\">Catering</a></li>"
new_li_catering = "<li><a href=\"#catering\" class=\"nav-link\" data-target=\"catering\">Catering</a></li>"
content = content.replace(old_li_catering, new_li_catering, 1)

old_li_location = "<li><a href=\"#location\">Location</a></li>"
new_li_location = "<li><a href=\"#about\" class=\"nav-link\" data-target=\"about\">About</a></li>\n        <li><a href=\"#location\" class=\"nav-link\" data-target=\"location\">Location</a></li>"
content = content.replace(old_li_location, new_li_location, 1)

content = content.replace('<span>Call Now</span>', '<span>Call</span>', 1)
content = content.replace('class="btn-primary btn-whatsapp nav-btn">', 'class="btn-whatsapp nav-btn nav-wa-btn">', 1)

content = content.replace(
    '<button class="mobile-nav-toggle" id="mobile-menu-btn" aria-label="Toggle navigation">',
    '<button class="mobile-nav-toggle" id="mobile-menu-btn" aria-label="Toggle navigation" aria-expanded="false">'
)

print(f"Final length: {len(content)}")
print("Has data-target=home:", "data-target=\"home\"" in content)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)
print("SAVED")
