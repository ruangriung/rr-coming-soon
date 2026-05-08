import os
import re

def get_title(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        match = re.search(r'title:\s*"(.*?)"', content)
        if match:
            return match.group(1)
    return None

dir_path = 'public/content/articles-md/'
titles = {}
duplicates = []

for filename in os.listdir(dir_path):
    if filename.endswith('.md'):
        path = os.path.join(dir_path, filename)
        title = get_title(path)
        if title:
            if title in titles:
                duplicates.append((titles[title], filename, title))
            else:
                titles[title] = filename

if duplicates:
    print("Duplicate titles found in markdown:")
    for original, dupe, title in duplicates:
        print(f"Title: {title}")
        print(f"  Original File: {original}")
        print(f"  Duplicate File: {dupe}")
        print("---")
else:
    print("No duplicate titles found in markdown.")
