import type { PortfolioData } from './templates';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

function getToken(): string | null {
  return sessionStorage.getItem('access_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface SavedPortfolio {
  id: string;
  title: string;
  templateId: string;
  data: PortfolioData;
  createdAt: string;
  updatedAt: string;
}

/** 포트폴리오 저장 */
export async function savePortfolioToServer(payload: {
  title: string;
  templateId: string;
  data: PortfolioData;
}): Promise<{ success: boolean; portfolio?: SavedPortfolio; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/portfolio/save`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  } catch {
    return { success: false, message: '서버 연결에 실패했습니다.' };
  }
}

/** 내 포트폴리오 목록 조회 */
export async function fetchMyPortfolios(): Promise<{ success: boolean; portfolios?: SavedPortfolio[]; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/portfolio/list`, {
      headers: authHeaders(),
    });
    return res.json();
  } catch {
    return { success: false, message: '서버 연결에 실패했습니다.' };
  }
}

/** 포트폴리오 삭제 */
export async function deletePortfolioFromServer(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/portfolio/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.status === 204) return { success: true };
    return await res.json();
  } catch {
    return { success: false, message: '서버 연결에 실패했습니다.' };
  }
}
