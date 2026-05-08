import os
import hashlib

def get_hash(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        # ignore frontmatter for hashing? 
        # or just hash the whole thing
        return hashlib.md5(f.read().encode('utf-8')).hexdigest()

dir_path = 'public/content/articles-md/'
hashes = {}
duplicates = []

for filename in os.listdir(dir_path):
    if filename.endswith('.md'):
        path = os.path.join(dir_path, filename)
        h = get_hash(path)
        if h in hashes:
            duplicates.append((hashes[h], filename))
        else:
            hashes[h] = filename

if duplicates:
    print("Identical content found:")
    for original, dupe in duplicates:
        print(f"Original: {original}")
        print(f"Duplicate: {dupe}")
else:
    print("No identical content found.")
