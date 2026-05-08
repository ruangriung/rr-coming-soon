export async function onRequest(context: any) {
    const { request, env } = context;
    const method = request.method;

    try {
        const POLLINATIONS_API_KEY = env.POLLINATIONS_API_KEY || env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
        const clientKey = request.headers.get('x-pollinations-key') || 
                          request.headers.get('Authorization')?.replace('Bearer ', '');
        const apiKey = clientKey || POLLINATIONS_API_KEY;

        const baseUrl = apiKey ? 'https://gen.pollinations.ai' : 'https://text.pollinations.ai';

        if (method === 'GET') {
            const url = new URL(request.url);
            const prompt = url.searchParams.get('prompt')?.trim();
            if (!prompt) return new Response('Prompt is required', { status: 400 });

            const finalUrl = `${baseUrl}/text/${encodeURIComponent(prompt)}?${url.searchParams.toString()}`;
            const headers: any = { 'Referer': 'https://ruangriung.my.id' };
            if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

            const response = await fetch(finalUrl, { method: 'GET', headers });
            return new Response(response.body, { status: response.status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        }

        if (method === 'POST') {
            const body: any = await request.json();
            const upstreamPayload = {
                model: body.model || 'openai',
                messages: body.messages || [{ role: 'user', content: body.prompt }],
                temperature: body.temperature,
                seed: body.seed,
                stream: body.stream,
                max_tokens: body.max_tokens,
                json: body.json
            };

            const headers: any = { 'Content-Type': 'application/json', 'Referer': 'https://ruangriung.my.id' };
            if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

            const response = await fetch(`${baseUrl}/v1/chat/completions`, {
                method: 'POST',
                headers,
                body: JSON.stringify(upstreamPayload)
            });

            if (body.stream) {
                return new Response(response.body, { headers: { 'Content-Type': 'text/event-stream' } });
            }

            const data: any = await response.json();
            const content = data?.choices?.[0]?.message?.content || JSON.stringify(data);
            return new Response(content, { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        }

        return new Response('Method not allowed', { status: 405 });

    } catch (error: any) {
        return new Response(error.message, { status: 500 });
    }
}
