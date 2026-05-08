import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = path.join(__dirname, '../public/content/articles-md');

// Load .env manually if running locally
if (fs.existsSync(path.join(__dirname, '../.env'))) {
  const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...val] = trimmedLine.split('=');
      if (key && val.length > 0) {
        process.env[key.trim()] = val.join('=').trim().replace(/^["'](.*)["']$/, '$1');
      }
    }
  });
}

async function generateBlog() {
  // 1. Get existing article titles to avoid repetition
  const existingFiles = fs.existsSync(ARTICLES_DIR) ? fs.readdirSync(ARTICLES_DIR) : [];
  const existingTitles = existingFiles.map(f => f.replace(/\.md$/, '').replace(/-/g, ' '));
  
  console.log(`Analyzing ${existingTitles.length} existing articles to ensure unique content...`);

  const apiKey = process.env.POLLINATIONS_API_KEY;
  if (!apiKey) {
    console.error("Error: POLLINATIONS_API_KEY is missing!");
    process.exit(1);
  }

  const prompt = `
    Tugas: Bertindak sebagai Editor Konten Senior untuk "RuangRiung", sebuah platform AI Multimedia di Indonesia.
    
    Konteks: Kami sudah memiliki artikel dengan topik berikut:
    ${existingTitles.slice(-20).join(', ')}
    
    Instruksi:
    1. Pilih satu topik BARU yang sedang tren atau sangat berguna di dunia AI (Gambar, Video, Suara, atau Produktivitas).
    2. Topik HARUS berbeda dan unik dari daftar di atas.
    3. Tulis artikel mendalam dalam Bahasa Indonesia.
    
    Format output HARUS JSON murni dengan struktur:
    {
      "title": "Judul unik & SEO friendly",
      "summary": "Ringkasan (max 200 karakter)",
      "category": "Tutorial / Berita / Inspirasi",
      "tags": ["tag1", "tag2", "tag3"],
      "content": "Konten Markdown lengkap (>500 kata)"
    }
    Ketentuan Konten:
    - Gaya bahasa: Edukatif, Inspiratif, dan Ramah (Indonesian).
    - Berikan tips praktis atau pandangan masa depan yang menarik.
    - Sebutkan fitur RuangRiung sesekali jika relevan.
    - Jangan sertakan teks apapun di luar struktur JSON tersebut.
  `;

  const models = ['gemini', 'openai', 'mistral', 'mistral-large', 'deepseek', 'searchgpt'];
  let responseText = '';
  let lastError = null;

  for (const model of models) {
    try {
      console.log(`Generating content using model: ${model}...`);
      const response = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          jsonFallback: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        responseText = data.choices[0].message.content;
        if (responseText) break;
      } else {
        lastError = await response.text();
        console.warn(`Model ${model} returned status ${response.status}: ${lastError}`);
      }
    } catch (err) {
      lastError = err.message;
      console.error(`Error with model ${model}:`, err.message);
    }
  }

  if (!responseText) {
    console.error("Failed to generate content with all available models.");
    if (lastError) console.error("Last error:", lastError);
    process.exit(1);
  }

  let cleanJson = responseText.trim();
  if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.replace(/^```json|```$/g, '').trim();
  }

  try {
    const result = JSON.parse(cleanJson);
    const slug = result.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const date = new Date().toISOString();

    const fileContent = `---
title: "${result.title}"
date: "${date}"
author: "RuangRiung AI"
summary: "${result.summary.replace(/"/g, '\\"')}"
image: "/assets/ruangriung.png"
category: "${result.category}"
tags: ${JSON.stringify(result.tags)}
---

${result.content}
`;

    if (!fs.existsSync(ARTICLES_DIR)) {
      fs.mkdirSync(ARTICLES_DIR, { recursive: true });
    }

    const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
    fs.writeFileSync(filePath, fileContent);
    console.log(`\nSUCCESS: Blog post generated!`);
    console.log(`Title: ${result.title}`);
    console.log(`Path: ${filePath}`);
    
  } catch (err) {
    console.error("Failed to parse AI response as JSON.");
    console.error("Raw response:", responseText);
    process.exit(1);
  }
}

generateBlog();
