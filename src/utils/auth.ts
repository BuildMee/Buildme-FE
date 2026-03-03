const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID as string | undefined;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export function handleGitHubLogin() {
  if (!GITHUB_CLIENT_ID) {
    console.error('VITE_GITHUB_CLIENT_ID 환경변수가 설정되지 않았습니다.');
    return;
  }
  const state = crypto.randomUUID();
  sessionStorage.setItem('oauth_state', state);
  sessionStorage.setItem('oauth_provider', 'github');
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    scope: 'read:user,repo,read:org',
    state,
  });
  window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export function handleGoogleLogin() {
  if (!GOOGLE_CLIENT_ID) return;
  const state = crypto.randomUUID();
  sessionStorage.setItem('oauth_state', state);
  sessionStorage.setItem('oauth_provider', 'google');
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: window.location.origin,
    response_type: 'code',
    scope: 'openid email profile',
    state,
  });
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
