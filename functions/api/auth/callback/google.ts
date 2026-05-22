export async function onRequest(context: any) {
    const { request, env } = context;
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const errorParam = url.searchParams.get('error');

    if (errorParam) {
        return Response.redirect(`${url.origin}/generator?login_error=${encodeURIComponent(errorParam)}`, 302);
    }

    if (!code) {
        return Response.redirect(`${url.origin}/generator?login_error=missing_code`, 302);
    }

    try {
        const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
        const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;

        if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
            return new Response(
                JSON.stringify({ message: 'Google credentials are not fully configured in env' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const redirectUri = `${url.origin}/api/auth/callback/google`;

        // 1. Exchange code for access token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.text();
            return Response.redirect(`${url.origin}/generator?login_error=token_exchange_failed&details=${encodeURIComponent(errorData)}`, 302);
        }

        const tokens = await tokenResponse.json() as { access_token: string; id_token?: string };

        // 2. Fetch user profile from Google UserInfo API
        const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                'Authorization': `Bearer ${tokens.access_token}`,
            },
        });

        if (!userinfoResponse.ok) {
            return Response.redirect(`${url.origin}/generator?login_error=userinfo_fetch_failed`, 302);
        }

        const userProfile = await userinfoResponse.json() as {
            sub: string;
            name: string;
            given_name?: string;
            family_name?: string;
            picture?: string;
            email: string;
            email_verified?: boolean;
        };

        // 3. Serialize user data to send to frontend
        const serializedUser = btoa(unescape(encodeURIComponent(JSON.stringify({
            id: userProfile.sub,
            name: userProfile.name,
            email: userProfile.email,
            picture: userProfile.picture
        }))));

        // 4. Redirect user back to the generator page with serialized user profile in query
        return Response.redirect(`${url.origin}/generator?login_success=true&user=${serializedUser}`, 302);

    } catch (error: any) {
        return Response.redirect(`${url.origin}/generator?login_error=internal_error&message=${encodeURIComponent(error.message)}`, 302);
    }
}
