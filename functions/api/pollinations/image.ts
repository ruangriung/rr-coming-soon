export async function onRequest(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;

  try {
    let prompt: string | null = null;
    let params: any = {};

    if (method === 'GET') {
      prompt = url.searchParams.get('prompt');
      url.searchParams.forEach((value, key) => {
        if (key !== 'prompt') params[key] = value;
      });
    } else if (method === 'POST') {
      const body: any = await request.json();
      prompt = body.prompt;
      params = body;
    }

    if (!prompt) {
      return new Response(JSON.stringify({ message: 'Prompt is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const POLLINATIONS_API_KEY = env.POLLINATIONS_API_KEY || env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
    const clientKey = request.headers.get('x-pollinations-key') || 
                      request.headers.get('Authorization')?.replace('Bearer ', '');
    const activeApiKey = clientKey || POLLINATIONS_API_KEY;

    const pollParams = new URLSearchParams();
    const supportedParams = [
      'model', 'width', 'height', 'seed', 'enhance', 'nologo',
      'negative_prompt', 'safe', 'quality', 'transparent',
      'image', 'duration', 'aspectRatio', 'audio', 't'
    ];

    // Map frontend camelCase to API snake_case
    if (params.negativePrompt && !params.negative_prompt) {
      params.negative_prompt = params.negativePrompt;
    }

    Object.keys(params).forEach(key => {
      if (supportedParams.includes(key) && params[key] !== 'undefined' && params[key] !== null) {
        if (key === 'model') {
          pollParams.set(key, params[key].toString().toLowerCase());
        } else {
          pollParams.set(key, params[key].toString());
        }
      }
    });

    if (activeApiKey) {
      pollParams.set('key', activeApiKey);
    }

    const baseUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}`;
    
    const headers: Record<string, string> = {
      'Accept': 'image/*, application/json',
      'Referer': 'https://ruangriung.my.id',
      'User-Agent': 'RuangRiung-Generator/1.0',
    };

    if (activeApiKey) {
      headers['Authorization'] = `Bearer ${activeApiKey}`;
    }

    let response;
    if (method === 'POST') {
      // Use POST for large payloads (like base64 images)
      headers['Content-Type'] = 'application/json';
      response = await fetch(baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...params,
          prompt,
          key: activeApiKey
        })
      });
    } else {
      // Use GET for standard requests
      const apiUrl = `${baseUrl}?${pollParams.toString()}`;
      response = await fetch(apiUrl, {
        method: 'GET',
        headers,
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ message: `Pollinations API Error: ${response.status}`, error: errorText }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');

    return new Response(response.body, {
      status: 200,
      headers: newHeaders
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
