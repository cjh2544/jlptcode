export const ADMIN_DEFAULT_PAGE_SIZE = 10;
export const ADMIN_MAX_PAGE_SIZE = 100;
export const ADMIN_MAX_KEYWORD_LENGTH = 200;

/** RegExp 특수문자 이스케이프 (ReDoS·의도치 않은 패턴 방지) */
export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function clampAdminPageSize(size: unknown) {
  const parsed = Number(size);
  if (!Number.isFinite(parsed) || parsed < 1) return ADMIN_DEFAULT_PAGE_SIZE;
  return Math.min(Math.floor(parsed), ADMIN_MAX_PAGE_SIZE);
}

export function clampAdminPage(page: unknown) {
  const parsed = Number(page);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

export function normalizeAdminKeyword(keyword: unknown) {
  if (keyword == null) return "";
  const text = String(keyword).trim();
  if (!text) return "";
  return text.slice(0, ADMIN_MAX_KEYWORD_LENGTH);
}

export type AdminPageRequest = {
  currentPage: number;
  pageSize: number;
};

export function parseAdminPageRequest(pageInfo?: {
  currentPage?: unknown;
  pageSize?: unknown;
}): AdminPageRequest {
  return {
    currentPage: clampAdminPage(pageInfo?.currentPage),
    pageSize: clampAdminPageSize(pageInfo?.pageSize),
  };
}

const ADMIN_API_EXACT_PATHS = new Set([
  "/api/user/list",
  "/api/user/page",
  "/api/user/role",
  "/api/user/reset-password",
]);

/** 관리자 전용 API 경로 (미들웨어 1차 차단용) */
export function isAdminApiPath(pathname: string, method: string) {
  const normalizedMethod = method.toUpperCase();

  if (pathname.startsWith("/api/admin/")) return true;
  if (ADMIN_API_EXACT_PATHS.has(pathname)) return true;

  if (pathname === "/api/user" && normalizedMethod === "GET") return true;
  if (pathname === "/api/userPayment" && normalizedMethod === "POST") return true;
  if (/^\/api\/user\/[^/]+$/.test(pathname) && normalizedMethod === "GET") {
    return true;
  }

  return false;
}

const VIRTUAL_ADMIN_PAYLOAD_KEYS = new Set(["studyRound", "_id", "id"]);

export function stripVirtualAdminPayloadKeys(
  payload: Record<string, unknown>,
) {
  const next = { ...payload };
  for (const key of VIRTUAL_ADMIN_PAYLOAD_KEYS) {
    delete next[key];
  }
  delete next.createdAt;
  delete next.updatedAt;
  return next;
}
