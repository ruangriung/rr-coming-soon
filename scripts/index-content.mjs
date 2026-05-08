import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = path.join(__dirname, '../public/content/articles-md');
const PROMPTS_DIR = path.join(__dirname, '../public/content/prompts');
const OUTPUT_POSTS = path.join(__dirname, '../public/posts.json');
const OUTPUT_PROMPTS = path.join(__dirname, '../public/prompts-index.json');
const OUTPUT_SITEMAP = path.join(__dirname, '../public/sitemap.xml');

const BASE_URL = 'https://ruangriung.my.id';

function parseFrontmatter(md) {
  const regex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = md.match(regex);
  if (!match) return { data: {}, content: md };

  const yaml = match[1];
  const data = {};
  
  yaml.split('\n').forEach(line => {
    const [key, ...val] = line.split(':');
    if (key && val.length > 0) {
      let v = val.join(':').trim().replace(/^["'](.*)["']$/, '$1');
      if (key.trim() === 'tags') {
        const tagsMatch = yaml.match(/tags:\s*\n((\s*-\s*.*\n?)*)/);
        if (tagsMatch) {
          data.tags = tagsMatch[1].split('\n').map(l => l.replace(/^\s*-\s*/, '').trim()).filter(t => t);
        } else {
          const inline = yaml.match(/tags:\s*\[(.*)\]/);
          if (inline) data.tags = inline[1].split(',').map(t => t.trim().replace(/^["'](.*)["']$/, '$1'));
        }
      } else {
        data[key.trim()] = v;
      }
    }
  });
  return { data };
}

function generateIndex() {
  let allArticles = [];
  let allPrompts = [];

  // Articles
  if (fs.existsSync(ARTICLES_DIR)) {
    const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
    allArticles = files.map(file => {
      const slug = file.replace(/\.md$/, '');
      const content = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
      const { data } = parseFrontmatter(content);
      return { slug, ...data };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    fs.writeFileSync(OUTPUT_POSTS, JSON.stringify(allArticles, null, 2));
    console.log(`Generated index for ${allArticles.length} articles.`);
  }

  // Prompts
  if (fs.existsSync(PROMPTS_DIR)) {
    const files = fs.readdirSync(PROMPTS_DIR).filter(f => f.endsWith('.md'));
    allPrompts = files.map(file => {
      const slug = file.replace(/\.md$/, '');
      const content = fs.readFileSync(path.join(PROMPTS_DIR, file), 'utf8');
      const { data } = parseFrontmatter(content);
      return { slug, ...data };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    fs.writeFileSync(OUTPUT_PROMPTS, JSON.stringify(allPrompts, null, 2));
    console.log(`Generated index for ${allPrompts.length} prompts.`);
  }

  // Sitemap
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/artikel', priority: '0.9', changefreq: 'daily' },
    { url: '/kumpulan-prompt', priority: '0.9', changefreq: 'daily' },
    { url: '/generator', priority: '0.8', changefreq: 'weekly' }
  ];

  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  staticPages.forEach(page => {
    sitemapXml += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  allArticles.forEach(article => {
    sitemapXml += `  <url>
    <loc>${BASE_URL}/artikel/${article.slug}</loc>
    <lastmod>${article.date ? new Date(article.date).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  });

  allPrompts.forEach(prompt => {
    sitemapXml += `  <url>
    <loc>${BASE_URL}/kumpulan-prompt/${prompt.slug}</loc>
    <lastmod>${prompt.date ? new Date(prompt.date).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  });

  sitemapXml += `</urlset>`;
  fs.writeFileSync(OUTPUT_SITEMAP, sitemapXml);
  console.log(`Generated sitemap.xml with ${staticPages.length + allArticles.length} entries.`);
}

generateIndex();
