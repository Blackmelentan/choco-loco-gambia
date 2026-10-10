import re
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
sections = [m.group(1) for m in re.finditer(r'<section id="([^"]+)"', content)]
print('Sections:', sections)
print('Has page-view:', 'page-view' in content)
