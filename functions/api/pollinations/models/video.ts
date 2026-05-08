// functions/api/pollinations/models/video.ts

const MODEL_MAPPING: Record<string, { title: string; description: string }> = {
  'veo': { title: 'Veo 3.1 Fast', description: 'Google DeepMind - Cinematic & High Quality' },
  'wan': { title: 'Wan 2.6', description: 'Professional Video Generation' },
  'wan-fast': { title: 'Wan 2.2', description: 'Quick Generation - Professional' },
  'ltx-2': { title: 'LTX-2.3', description: 'Next-gen Video Architecture' },
  'seedance': { title: 'Seedance Lite', description: 'Fast & Creative Video' },
  'seedance-2.0': { title: 'Seedance 2.0', description: 'High Fidelity Artistic Video' },
  'seedance-pro': { title: 'Seedance Pro-Fast', description: 'Professional Fast Rendering' },
  'grok-video-pro': { title: 'Grok Video Pro', description: 'xAI - Advanced Video Generation' },
  'nova-reel': { title: 'Nova Reel', description: 'Amazon - Dynamic Cinematic Video' },
  'p-video': { title: 'Pruna p-video', description: 'Optimized Video Performance' }
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

    const apiUrl = 'https://gen.pollinations.ai/v1/models';
    const response = await fetch(apiUrl, { headers });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    let allModels = [];
    
    if (data && Array.isArray(data.data)) {
      allModels = data.data;
    } else if (Array.isArray(data)) {
      allModels = data;
    }

    const videoModels = allModels
      .filter((m: any) => {
        const modalities = m.output_modalities || [];
        const id = (m.id || '').toLowerCase();
        return modalities.includes('video') || id.includes('video') || id.includes('veo') || id.includes('wan') || id.includes('ltx') || id.includes('seedance') || id.includes('reel');
      })
      .map((m: any) => {
        const mapping = MODEL_MAPPING[m.id] || { 
          title: m.id.replace(/-/g, ' ').replace(/\b\w/g, (l: any) => l.toUpperCase()), 
          description: `AI Video Generation with ${m.id}` 
        };
        
        // Extract pricing info
        const pricing = m.pricing || {};
        const cost = pricing.price_per_second || pricing.price_per_image || 0;
        
        return {
          id: m.id,
          name: mapping.title,
          description: mapping.description,
          cost: cost > 0 ? `${cost.toFixed(3)}/sec` : 'FREE',
          isPro: m.paid_only === true || m.id.toLowerCase().includes('-pro') || m.id.toLowerCase().includes('veo') || m.id.toLowerCase().includes('wan') || m.id.toLowerCase().includes('grok') || m.id.toLowerCase().includes('nova')
        };
      });

    // Ensure common models are present even if API fails to list them perfectly
    const essentialModels = ['veo', 'wan', 'ltx-2', 'seedance-pro'];
    essentialModels.forEach(id => {
      if (!videoModels.find(m => m.id === id)) {
        const mapping = MODEL_MAPPING[id];
        videoModels.push({
          id: id,
          name: mapping.title,
          description: mapping.description,
          cost: id === 'veo' ? '0.150/sec' : '0.075/sec',
          isPro: true
        });
      }
    });

    return new Response(JSON.stringify(videoModels), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache' 
      }
    });
  } catch (error: any) {
    const fallbacks = Object.keys(MODEL_MAPPING).slice(0, 5).map(id => ({
      id: id,
      name: MODEL_MAPPING[id].title,
      description: MODEL_MAPPING[id].description,
      cost: '0.150/sec',
      isPro: true
    }));
    return new Response(JSON.stringify(fallbacks), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
