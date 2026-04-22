import { Application, AIAnalysisResult } from "../types";

// 프롬프트 구성
export function buildAnalysisPrompt(applications: Application[]): string {
  const passed = applications.filter((a) => a.stage === "합격");
  const failed = applications.filter((a) => a.stage === "불합격");

  const format = (apps: Application[]) =>
    apps.map((a) => ({
      company: a.companyName,
      domain: a.domain,
      size: a.companySize,
      techStack: a.techStack,
    }));

  return `
당신은 취업 전략 전문가입니다. 아래 지원 데이터를 분석하여 합격 패턴과 커리어 방향을 JSON으로 반환해주세요.

합격 기업 (${passed.length}개):
${JSON.stringify(format(passed), null, 2)}

불합격 기업 (${failed.length}개):
${JSON.stringify(format(failed), null, 2)}

다음 JSON 형식으로만 응답해주세요. 다른 텍스트 없이 JSON만 반환하세요:
{
  "summary": "전체 지원 현황 요약 (2~3줄)",
  "passPatterns": {
    "domains": ["합격이 많은 도메인들"],
    "companySize": ["합격이 많은 기업 규모"],
    "techStack": ["합격 기업과 겹치는 기술스택"]
  },
  "failPatterns": {
    "domains": ["불합격이 많은 도메인들"],
    "commonFactors": ["불합격 공통 요인 분석"]
  },
  "direction": "전문화 또는 다양화 또는 분석불가",
  "directionGuide": "커리어 방향 가이드 (3~4줄, 구체적으로)",
  "recommendations": ["추천 액션 1", "추천 액션 2", "추천 액션 3"]
}
  `.trim();
}

// Claude API 응답 파싱
export function parseAnalysisResult(text: string): AIAnalysisResult {
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as AIAnalysisResult;
}

// 도메인별 합격률 계산
export function calcDomainStats(applications: Application[]) {
  const domainMap = new Map<string, { total: number; passed: number }>();

  applications.forEach((a) => {
    if (!domainMap.has(a.domain)) {
      domainMap.set(a.domain, { total: 0, passed: 0 });
    }
    const stat = domainMap.get(a.domain)!;
    stat.total++;
    if (a.stage === "합격") stat.passed++;
  });

  return Array.from(domainMap.entries()).map(([domain, stat]) => ({
    domain,
    total: stat.total,
    passed: stat.passed,
    passRate: stat.total > 0 ? Math.round((stat.passed / stat.total) * 100) : 0,
  }));
}
