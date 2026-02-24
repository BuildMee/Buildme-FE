import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

/**
 * POST /api/auth/github
 * 프론트엔드에서 받은 OAuth code를 GitHub access_token으로 교환합니다.
 *
 * Body: { code: string }
 * Response: { access_token: string, token_type: string, scope: string }
 */
router.post('/github', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.body as { code?: string };

    if (!code) {
      res.status(400).json({ success: false, message: 'code가 필요합니다.' });
      return;
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      res.status(500).json({ success: false, message: 'GitHub OAuth 설정이 되어 있지 않습니다.' });
      return;
    }

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenRes.json() as {
      access_token?: string;
      token_type?: string;
      scope?: string;
      error?: string;
      error_description?: string;
    };

    if (tokenData.error) {
      res.status(400).json({
        success: false,
        message: tokenData.error_description ?? 'GitHub 인증 실패',
      });
      return;
    }

    res.json({
      success: true,
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      scope: tokenData.scope,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 * access_token으로 GitHub 사용자 정보를 조회합니다.
 *
 * Header: Authorization: Bearer <access_token>
 */
router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: '인증 토큰이 필요합니다.' });
      return;
    }

    const token = authHeader.slice(7);

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!userRes.ok) {
      res.status(401).json({ success: false, message: '유효하지 않은 토큰입니다.' });
      return;
    }

    const user = await userRes.json();
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

export default router;
