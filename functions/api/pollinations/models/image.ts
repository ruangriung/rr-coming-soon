// functions/api/pollinations/models/image.ts

const IMAGE_MODEL_MAPPING: Record<string, string> = {
  'flux': 'Flux Schnell',
  'klein': 'Flux Klein 4B',
  'zimage': 'Z-Image Turbo',
  'kontext': 'Flux Kontext (In-context)',
  'wan-image': 'Wan 2.7 Image',
  'wan-image-pro': 'Wan 2.7 Image Pro (4K Thinking)',
  'qwen-image': 'Qwen Image Plus',
  'gptimage': 'GPT Image 1 Mini',
  'gptimage-large': 'GPT Image 1.5',
  'gpt-image-2': 'GPT Image 2 (Premium Pro)',
  'nanobanana': 'NanoBanana (Fast)',
  'nanobanana-2': 'NanoBanana 2',
  'nanobanana-pro': 'NanoBanana Pro (Gemini 3 Pro)',
  'seedream': 'Seedream 4.0 (Photorealistic)',
  'seedream5': 'Seedream 5.0 Lite',
  'seedream-pro': 'Seedream 4.5 Pro (Premium Photo)',
  'grok-imagine': 'Grok Imagine',
  'grok-imagine-pro': 'Grok Imagine Pro (Aurora)',
  'p-image': 'Pruna Image (Fast)',
  'p-image-edit': 'Pruna Image Edit',
  'nova-canvas': 'Amazon Nova Canvas'
};

export async function onRequestGet(context: any) {
  const { request } = context;
  
  try {
    const clientKey = request.headers.get('x-pollinations-key') || 
                      request.headers.get('Authorization')?.replace('Bearer ', '');
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Referer': 'https://ruangriung.my.id',
      'User-Agent': 'RuangRiung-Generator/1.0',
    };

    // Hanya kirim Authorization header jika pengguna mengirimkan key miliknya sendiri (BYOP).
    // Jika tidak ada clientKey, panggil API tanpa key agar model PRO tetap dikembalikan di daftar model.
    if (clientKey) {
      headers['Authorization'] = `Bearer ${clientKey}`;
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
