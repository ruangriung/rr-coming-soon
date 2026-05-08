import json

with open('public/posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

seen_titles = {}
for post in posts:
    title = post['title']
    slug = post['slug']
    if title in seen_titles:
        seen_titles[title].append(slug)
    else:
        seen_titles[title] = [slug]

print("Duplicate titles:")
for title, slugs in seen_titles.items():
    if len(slugs) > 1:
        print(f"Title: {title}")
        for slug in slugs:
            print(f"  Slug: {slug}")
        print("---")
