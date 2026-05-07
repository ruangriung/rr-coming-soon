// functions/api/pollinations/models/image.ts

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

    const apiUrl = 'https://gen.pollinations.ai/image/models';
    console.log(`[Backend] Fetching models from ${apiUrl}...`);
    
    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      console.error(`[Backend] API failed with status: ${response.status}`);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[Backend] Successfully fetched ${Array.isArray(data) ? data.length : 'object'} models`);
    
    return new Response(JSON.stringify(data), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache' 
      }
    });
  } catch (error: any) {
    console.error('[Backend] Error:', error.message);
    // If API is down, return a minimal set that we know works
    const minimalFallback = ['flux', 'flux-realism', 'flux-anime', 'turbo'];
    return new Response(JSON.stringify(minimalFallback), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
