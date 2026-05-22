export async function onRequest(context: any) {
    const { request, env } = context;
    const url = new URL(request.url);

    try {
        const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;

        if (!GOOGLE_CLIENT_ID) {
            return new Response(
                JSON.stringify({ message: 'GOOGLE_CLIENT_ID is not configured in the environment' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const redirectUri = `${url.origin}/api/auth/callback/google`;

        const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
        googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
        googleAuthUrl.searchParams.set('response_type', 'code');
        googleAuthUrl.searchParams.set('scope', 'openid email profile');
        googleAuthUrl.searchParams.set('access_type', 'online');
        googleAuthUrl.searchParams.set('prompt', 'select_account');

        return new Response(null, {
            status: 302,
            headers: {
                'Location': googleAuthUrl.toString(),
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
    } catch (error: any) {
        return new Response(
            JSON.stringify({ message: 'Internal Server Error', error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
