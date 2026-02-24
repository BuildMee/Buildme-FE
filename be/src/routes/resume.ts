import { Router, Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${timestamp}-${safe}`);
  },
});

function pdfFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('PDF 파일만 업로드 가능합니다.'));
  }
}

const upload = multer({
  storage,
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/**
 * POST /api/resume/upload
 * 이력서 PDF 파일과 기본 정보를 받아 저장하고 분석 결과를 반환합니다.
 *
 * FormData:
 *   - file: PDF 파일 (필수)
 *   - name: 이름 (필수)
 *   - role: 직군 (필수)
 */
router.post('/upload', upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: '파일이 업로드되지 않았습니다.' });
      return;
    }

    const { name, role } = req.body as { name?: string; role?: string };

    if (!name || !role) {
      fs.unlinkSync(req.file.path);
      res.status(400).json({ success: false, message: '이름과 직군은 필수입니다.' });
      return;
    }

    // 실제 서비스에서는 여기서 AI 분석 (e.g. OpenAI API 호출)을 합니다.
    // 현재는 업로드 성공 및 메타데이터 반환으로 처리합니다.
    res.json({
      success: true,
      message: '이력서가 성공적으로 업로드되었습니다.',
      data: {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        name,
        role,
        uploadedAt: new Date().toISOString(),
        // 추후 AI 분석 결과가 여기에 추가됩니다
        analysisId: `analysis_${Date.now()}`,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
