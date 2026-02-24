import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

/**
 * GET /api/github/repos
 * 인증된 사용자의 GitHub 레포지토리 목록을 반환합니다.
 *
 * Header: Authorization: Bearer <access_token>
 * Query:  ?sort=updated&per_page=30
 */
router.get('/repos', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: '인증 토큰이 필요합니다.' });
      return;
    }

    const token = authHeader.slice(7);
    const sort = (req.query['sort'] as string) || 'updated';
    const perPage = (req.query['per_page'] as string) || '30';

    const reposRes = await fetch(
      `https://api.github.com/user/repos?sort=${sort}&per_page=${perPage}&type=owner`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
        },
      },
    );

    if (!reposRes.ok) {
      res.status(reposRes.status).json({ success: false, message: 'GitHub API 호출 실패' });
      return;
    }

    const repos = await reposRes.json() as Array<{
      id: number;
      name: string;
      full_name: string;
      description: string | null;
      html_url: string;
      language: string | null;
      stargazers_count: number;
      updated_at: string;
      private: boolean;
    }>;

    const simplified = repos.map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      updatedAt: r.updated_at,
      isPrivate: r.private,
    }));

    res.json({ success: true, repos: simplified });
  } catch (err) {
    next(err);
  }
});

export default router;
