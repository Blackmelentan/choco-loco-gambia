with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix remaining wraps that failed (about->menu, menu->studio, boutique->lounge)
# These use different comment strings

# Fix 1: about -> menu (use the actual comment found)
about_to_menu = '</section>\n\n  <!-- DIGITAL MENU SECTION -->'
if about_to_menu in content:
    content = content.replace(about_to_menu, '</section>\n  </div><!-- end page:about -->\n\n  <!-- PAGE: MENU -->\n  <div data-page="menu" class="page-view">\n  <!-- DIGITAL MENU SECTION -->', 1)
    print('about->menu wrapped ok')
else:
    print('STILL cannot find about->menu transition')

# Find menu->studio transition
import re
# Look for what comes after menu section
m = re.search(r'(</section>\s*\n\s*<!-- [A-Z].* STUDIO)', content)
if m:
    print('Found studio at:', repr(content[m.start():m.start()+80]))
    found_text = content[m.start():m.start()+80]
else:
    print('No studio comment found with that pattern')
    
# Try to find custom-studio section in the content
idx = content.find('<section id="custom-studio">')
if idx != -1:
    preceding = content[idx-200:idx]
    print('Preceding custom-studio:', repr(preceding[-100:]))

# Fix 2: menu -> studio
for possible in ['<!-- BUILD YOUR OWN DESSERT STUDIO', '<!-- CUSTOM DESSERT STUDIO', '<!-- DESSERT STUDIO', '<!-- STUDIO']:
    menu_to_studio = '</section>\n\n  ' + possible
    if menu_to_studio in content:
        content = content.replace(menu_to_studio, '</section>\n  </div><!-- end page:menu -->\n\n  <!-- PAGE: STUDIO -->\n  <div data-page="studio" class="page-view">\n  ' + possible, 1)
        print(f'menu->studio wrapped ok using: {possible}')
        break
else:
    # Try direct approach: find </section> before <section id="custom-studio">
    idx = content.find('<section id="custom-studio">')
    if idx != -1:
        # Find the preceding </section>
        prev_end = content.rfind('</section>', 0, idx)
        if prev_end != -1:
            old_chunk = content[prev_end:idx]
            new_chunk = old_chunk.rstrip() + '\n  </div><!-- end page:menu -->\n\n  <!-- PAGE: STUDIO -->\n  <div data-page="studio" class="page-view">\n'
            content = content[:prev_end] + new_chunk + content[idx:]
            print('menu->studio wrapped via direct idx approach')

# Fix 3: boutique -> lounge
for possible in ['<!-- LOUNGE GALLERY AND AMBIANCE', '<!-- GALLERY', '<!-- AMBIENT LOUNGE']:
    boutique_to_lounge = '</section>\n\n  ' + possible
    if boutique_to_lounge in content:
        content = content.replace(boutique_to_lounge, '</section>\n  </div><!-- end page:boutique -->\n\n  <!-- PAGE: LOUNGE -->\n  <div data-page="lounge" class="page-view">\n  ' + possible, 1)
        print(f'boutique->lounge wrapped ok using: {possible}')
        break
else:
    idx = content.find('<section id="gallery">')
    if idx != -1:
        prev_end = content.rfind('</section>', 0, idx)
        if prev_end != -1:
            old_chunk = content[prev_end:idx]
            new_chunk = old_chunk.rstrip() + '\n  </div><!-- end page:boutique -->\n\n  <!-- PAGE: LOUNGE -->\n  <div data-page="lounge" class="page-view">\n'
            content = content[:prev_end] + new_chunk + content[idx:]
            print('boutique->lounge wrapped via direct idx')

print()
print('Final page-view count:', content.count('data-page='))

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('SAVED')
