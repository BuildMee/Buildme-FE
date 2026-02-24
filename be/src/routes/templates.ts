import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  url: string;
  author: string;
  likes: number;
  createdAt: string;
}

// 인메모리 저장소 (DB 연동 전 임시 사용)
const templates: Template[] = [
  {
    id: '1',
    name: 'Neo Brutalist',
    category: 'creative',
    description: '굵은 테두리와 강렬한 타이포그래피가 특징인 브루탈리스트 디자인',
    tags: ['brutalist', 'bold', 'creative'],
    url: 'https://example.com/neo-brutalist',
    author: '@dev_kim',
    likes: 234,
    createdAt: '2025-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Terminal',
    category: 'tech',
    description: '터미널 스타일의 포트폴리오. 개발자 감성 최강',
    tags: ['terminal', 'dark', 'tech'],
    url: 'https://example.com/terminal',
    author: '@parkjiwon',
    likes: 189,
    createdAt: '2025-01-20T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Minimal Dark',
    category: 'dark',
    description: '다크 배경에 모노스페이스 폰트로 군더더기 없는 레이아웃',
    tags: ['minimal', 'dark', 'monospace'],
    url: 'https://example.com/minimal-dark',
    author: '@leesung',
    likes: 156,
    createdAt: '2025-02-01T00:00:00.000Z',
  },
];

/**
 * GET /api/templates
 * 커뮤니티 템플릿 목록을 반환합니다.
 *
 * Query: ?sort=popular|newest&category=all|minimal|dark|creative|tech
 */
router.get('/', (req: Request, res: Response) => {
  const sort = (req.query['sort'] as string) || 'popular';
  const category = (req.query['category'] as string) || 'all';

  let result = [...templates];

  if (category !== 'all') {
    result = result.filter((t) => t.category === category);
  }

  if (sort === 'popular') {
    result.sort((a, b) => b.likes - a.likes);
  } else {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json({ success: true, templates: result });
});

/**
 * POST /api/templates
 * 새 커뮤니티 템플릿을 등록합니다.
 *
 * Body: { name, category, description, tags, url }
 */
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, category, description, tags, url } = req.body as {
      name?: string;
      category?: string;
      description?: string;
      tags?: string | string[];
      url?: string;
    };

    if (!name || !category || !description || !url) {
      res.status(400).json({
        success: false,
        message: '이름, 카테고리, 설명, URL은 필수입니다.',
      });
      return;
    }

    const parsedTags: string[] =
      typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : Array.isArray(tags)
          ? tags
          : [];

    const newTemplate: Template = {
      id: String(Date.now()),
      name,
      category,
      description,
      tags: parsedTags,
      url,
      author: '@anonymous',
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    templates.push(newTemplate);

    res.status(201).json({ success: true, template: newTemplate });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/templates/:id/like
 * 템플릿에 좋아요를 추가합니다.
 */
router.post('/:id/like', (req: Request, res: Response) => {
  const template = templates.find((t) => t.id === req.params['id']);

  if (!template) {
    res.status(404).json({ success: false, message: '템플릿을 찾을 수 없습니다.' });
    return;
  }

  template.likes += 1;
  res.json({ success: true, likes: template.likes });
});

export default router;
