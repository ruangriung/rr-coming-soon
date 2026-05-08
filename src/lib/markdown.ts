export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  image: string;
  category: string;
  tags: string[];
  contentHtml: string;
}

export interface PromptItem {
  id: string;
  slug: string;
  title: string;
  author: string;
  date: string;
  tool: string;
  tags: string[];
  contentHtml: string;
}

/**
 * A simple markdown to HTML converter to avoid adding heavy dependencies
 * Handles headers, bold, italic, lists, and links
 */
function simpleMarkdownToHtml(md: string): string {
  if (!md) return '';
  
  let html = md
    .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-black mt-10 mb-4 uppercase italic text-slate-900 dark:text-white">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-black mt-14 mb-6 uppercase italic border-b border-slate-200 dark:border-white/10 pb-4 text-slate-900 dark:text-white">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-black mt-16 mb-8 uppercase italic text-slate-900 dark:text-white">$1</h1>')
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-orange-500 bg-slate-100 dark:bg-white/5 p-6 rounded-r-2xl italic my-8 text-slate-700 dark:text-white/80">$1</blockquote>')
    .replace(/\*\*(.*)\*\*/gim, '<strong class="text-slate-900 dark:text-white font-black">$1</strong>')
    .replace(/\*(.*)\*/gim, '<em class="italic text-slate-800 dark:text-white/90">$1</em>')
    .replace(/!\[(.*?)\]\((.*?)\)/gim, '<div class="my-10"><img alt="$1" src="$2" class="rounded-[2rem] border-2 border-slate-200 dark:border-white/10 shadow-2xl mx-auto" /></div>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-orange-500 hover:underline font-bold transition-all">$1</a>')
    .replace(/^\- (.*$)/gim, '<li class="ml-6 list-disc text-slate-600 dark:text-white/60 mb-2">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal text-slate-600 dark:text-white/60 mb-2">$1</li>')
    // Handle paragraphs properly: split by double newlines and wrap in <p>
    .split(/\n\n+/)
    .map(para => {
      if (para.trim().startsWith('<h') || para.trim().startsWith('<block') || para.trim().startsWith('<li') || para.trim().startsWith('<div')) {
        return para;
      }
      return `<p class="text-slate-600 dark:text-white/70 leading-relaxed text-lg mb-8 font-medium">${para.replace(/\n/g, '<br />')}</p>`;
    })
    .join('\n');

  return html;
}

export function parseMarkdown(md: string, slug: string): any {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = md.match(frontmatterRegex);

  if (!match) {
    return { 
      slug, 
      contentHtml: simpleMarkdownToHtml(md.trim()) 
    };
  }

  const yamlBlock = match[1];
  const rawContent = match[2].trim();
  const metadata: any = { 
    slug, 
    contentHtml: simpleMarkdownToHtml(rawContent) 
  };

  // Parse YAML-like metadata
  yamlBlock.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes
      value = value.replace(/^["'](.*)["']$/, '$1');
      
      if (key === 'tags') return; // Handled separately
      
      metadata[key] = value;
    }
  });

  // Handle tags array
  const tagsMatch = yamlBlock.match(/tags:\s*\n((\s*-\s*.*\n?)*)/);
  if (tagsMatch) {
    metadata.tags = tagsMatch[1]
      .split('\n')
      .map(line => line.replace(/^\s*-\s*/, '').trim())
      .filter(tag => tag !== '');
  } else {
    const inlineTagsMatch = yamlBlock.match(/tags:\s*\[(.*)\]/);
    if (inlineTagsMatch) {
      metadata.tags = inlineTagsMatch[1].split(',').map(t => t.trim().replace(/^["'](.*)["']$/, '$1'));
    }
  }

  return metadata;
}
