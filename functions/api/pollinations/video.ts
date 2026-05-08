export async function onRequest(context: any) {
    const { request, env } = context;
    const method = request.method;

    if (method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
    }

    try {
        const body: any = await request.json();
        const { prompt, model, ...params } = body;

        if (!prompt) {
            return new Response(JSON.stringify({ message: 'Prompt is required' }), { status: 400 });
        }

        const POLLINATIONS_API_KEY = env.POLLINATIONS_API_KEY || env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
        const clientKey = request.headers.get('x-pollinations-key') || 
                          request.headers.get('Authorization')?.replace('Bearer ', '');
        const activeApiKey = clientKey || POLLINATIONS_API_KEY;

        const pollParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                pollParams.set(key, String(value));
            }
        });
        
        if (activeApiKey) {
            pollParams.set('key', activeApiKey);
        }

        const baseUrl = 'https://gen.pollinations.ai/video';
        const finalUrl = `${baseUrl}/${encodeURIComponent(prompt)}?model=${model || 'veo'}&${pollParams.toString()}`;

        const headers: Record<string, string> = {
            'Accept': 'video/mp4, video/*',
            'Referer': 'https://ruangriung.my.id',
            'User-Agent': 'RuangRiung-Generator/1.0',
        };

        if (activeApiKey) {
            headers['Authorization'] = `Bearer ${activeApiKey}`;
        }

        const response = await fetch(finalUrl, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(JSON.stringify({ message: `Pollinations API Error: ${response.status}`, error: errorText }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const newHeaders = new Headers(response.headers);
        newHeaders.set('Access-Control-Allow-Origin', '*');
        newHeaders.set('Cache-Control', 'no-store');

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
