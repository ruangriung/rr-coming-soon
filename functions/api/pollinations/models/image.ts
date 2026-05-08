// functions/api/pollinations/models/image.ts

const IMAGE_MODEL_MAPPING: Record<string, string> = {
  'flux': 'Flux.1 Schnell',
  'flux-pro': 'Flux.1 Pro',
  'flux-realism': 'Flux Realism',
  'flux-anime': 'Flux Anime',
  'flux-3d': 'Flux 3D Render',
  'flux-civitai': 'Flux CivitAI',
  'any-dark': 'Any Dark V3',
  'turbo': 'SDXL Turbo',
  'stable-diffusion-xl': 'Stable Diffusion XL',
  'dalle-3': 'DALL-E 3',
  'midjourney': 'Midjourney Style',
  'ideogram': 'Ideogram v2',
  'aura-flow': 'Aura Flow',
  'recraft-v3': 'Recraft v3'
};

export async function onRequestGet(context: any) {
  const { request } = context;
  
  try {
    const POLLINATIONS_API_KEY = context.env.POLLINATIONS_API_KEY || context.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
    const clientKey = request.headers.get('x-pollinations-key') || 
                      request.headers.get('Authorization')?.replace('Bearer ', '');
    const activeKey = clientKey || POLLINATIONS_API_KEY;
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Referer': 'https://ruangriung.my.id',
      'User-Agent': 'RuangRiung-Generator/1.0',
    };

    if (activeKey) {
      headers['Authorization'] = `Bearer ${activeKey}`;
    }

    const apiUrl = 'https://gen.pollinations.ai/models';
    const response = await fetch(apiUrl, { headers });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    let allModels = [];
    
    if (Array.isArray(data)) {
      allModels = data;
    }

    const imageModels = allModels
      .filter((m: any) => {
        const modalities = m.output_modalities || [];
        return modalities.includes('image');
      })
      .map((m: any) => ({
        id: m.name || m.id,
        name: IMAGE_MODEL_MAPPING[m.name || m.id] || m.name || m.id.replace(/-/g, ' ').replace(/\b\w/g, (l: any) => l.toUpperCase()),
        isPro: m.paid_only === true
      }));

    console.log('Filtered image models count:', imageModels.length);

    if (imageModels.length === 0) {
      return new Response(JSON.stringify([
        { id: 'flux', name: 'Flux.1 Schnell', isPro: false },
        { id: 'flux-pro', name: 'Flux.1 Pro', isPro: true }
      ]), { headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify(imageModels), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache' 
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify([{ id: 'flux', name: 'Flux.1', isPro: false }]), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
