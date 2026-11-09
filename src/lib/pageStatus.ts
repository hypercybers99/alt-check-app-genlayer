import storedPages from "../data/stored_pages.json";

export interface StoredPageMeta {
  id: string;
  label: string;
  stored_url: string;
  retired: boolean;
  audits_total: number;
  last_score: number | null;
  last_grade: string | null;
  partial: boolean | null;
  http_status: number;
  registrant: string;
  registered_at: string;
}

export interface PageAvailability {
  httpStatus: number;
  isAvailable: boolean;
  notice: string | null;
}

export function getPageAvailability(pageId?: string, url?: string): PageAvailability {
  const pages = storedPages as StoredPageMeta[];
  const found = pages.find((p) => (pageId && p.id === pageId) || (url && p.stored_url === url));

  if (!found) {
    // If not in historical snapshot, default to assuming active 200 unless URL is huzyow155
    if (url && url.includes("huzyow155.github.io")) {
      return {
        httpStatus: 404,
        isAvailable: false,
        notice: "The source host no longer serves this URL (HTTP 404). The stored audit result is still readable; a new audit of this page cannot be run.",
      };
    }
    return {
      httpStatus: 200,
      isAvailable: true,
      notice: null,
    };
  }

  if (found.http_status !== 200) {
    return {
      httpStatus: found.http_status,
      isAvailable: false,
      notice: `The source host no longer serves this URL (HTTP ${found.http_status}). The stored audit result is still readable; a new audit of this page cannot be run.`,
    };
  }

  return {
    httpStatus: 200,
    isAvailable: true,
    notice: null,
  };
}
