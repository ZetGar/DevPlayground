export interface OGData {
  companyName: string;
  jobTitle: string;
  url: string;
}

// URL에서 OG 메타데이터 파싱 (API Route에서 사용)
export async function fetchOGData(url: string): Promise<OGData> {
  const res = await fetch(`/api/job-log/og-parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) throw new Error("OG 파싱 실패");
  return res.json();
}

// OG 태그 파싱 (서버 사이드)
export function parseOGFromHTML(html: string, url: string): OGData {
  const getTag = (property: string) => {
    const match = html.match(
      new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`, "i")
    ) || html.match(
      new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property}["']`, "i")
    );
    return match?.[1] ?? "";
  };

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

  return {
    companyName: getTag("og:site_name") || new URL(url).hostname.replace("www.", ""),
    jobTitle: getTag("og:title") || titleMatch?.[1] || "",
    url,
  };
}
