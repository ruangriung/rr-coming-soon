export async function onRequest(context: any) {
    const { request, env } = context;
    const url = new URL(request.url);

    try {
        const text = url.searchParams.get('text');
        const voice = url.searchParams.get('voice') || 'alloy';

        if (!text) {
            return new Response(JSON.stringify({ message: 'Text is required' }), { status: 400 });
        }

        const POLLINATIONS_API_KEY = env.POLLINATIONS_API_KEY || env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
        const clientKey = request.headers.get('x-pollinations-key') || 
                          request.headers.get('Authorization')?.replace('Bearer ', '');
        const activeApiKey = clientKey || POLLINATIONS_API_KEY;

        const queryParams = new URLSearchParams({
            voice: voice,
            response_format: 'mp3',
            model: 'tts-1',
        });

        const pollinatorUrl = `https://gen.pollinations.ai/audio/${encodeURIComponent(text)}?${queryParams.toString()}`;

        const headers: Record<string, string> = {
            'Referer': 'https://ruangriung.my.id',
            'User-Agent': 'RuangRiung-Generator/1.0',
        };

        if (activeApiKey) {
            headers['Authorization'] = `Bearer ${activeApiKey}`;
        }

        const response = await fetch(pollinatorUrl, {
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
        newHeaders.set('Content-Type', 'audio/mpeg');
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
