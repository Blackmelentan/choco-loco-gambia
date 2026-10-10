with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
import re
pages = re.findall(r'data-page=\"([^\"]+)\"', content)
print('Pages found:', pages)
print('Total:', len(pages))
