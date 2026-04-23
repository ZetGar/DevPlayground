import { Application, AIAnalysisResult } from "../types";

export const generateAiGuide = (company: string, jobTitle: string, domain: string) => {
  const lowerDomain = domain.toLowerCase();
  
  // 1. 기본 분석 데이터 설정
  const baseGuide = {
    checkpoints: [
      { id: 1, task: `${company}의 최근 1년 내 기술 블로그 및 보도자료 분석`, done: false },
      { id: 2, task: `${jobTitle} 공고 내 핵심 기술 스택 관련 프로젝트 리마인드`, done: false },
      { id: 3, task: `${domain} 산업군의 시장 점유율 및 경쟁사 서비스 비교`, done: false },
    ],
    expected_questions: [
      `왜 수많은 회사 중 ${company}여야만 하나요?`,
      `${jobTitle}로서 본인이 기여할 수 있는 가장 큰 기술적 가치는 무엇인가요?`,
    ],
    tip: `${company}는 기술적 완성도와 비즈니스 임팩트를 중시합니다. 본인의 결과물이 '사용자'에게 어떤 변화를 주었는지 강조하세요.`,
  };

  // 2. 도메인별 맞춤 전략 (유연한 키워드 매칭)
  let selectedStrategies = [];

  const isFintech = lowerDomain.includes("fin") || lowerDomain.includes("핀테크") || lowerDomain.includes("금융");
  const isEcommerce = lowerDomain.includes("com") || lowerDomain.includes("커머스") || lowerDomain.includes("쇼핑");

  if (isFintech) {
    selectedStrategies = [
      {
        scenario: "보안 및 무결성",
        question: "사용자의 잔액 정보를 업데이트할 때 발생할 수 있는 레이스 컨디션을 어떻게 방지하겠습니까?",
        intent: "금융 서비스의 핵심인 정합성 유지 능력 확인",
        best_answer_tip: "DB 트랜잭션 격리 수준이나 낙관적 락(Optimistic Lock) 개념을 언급하세요."
      }
    ];
  } else if (isEcommerce) {
    selectedStrategies = [
      {
        scenario: "성능 최적화",
        question: "수천 개의 상품 이미지가 포함된 메인 페이지의 로딩 속도를 어떻게 획기적으로 개선하시겠습니까?",
        intent: "이미지 최적화 및 렌더링 효율 측정",
        best_answer_tip: "WebP 변환, CDN 활용, 가상 리스트 전략을 답변하세요."
      }
    ];
  } else {
    selectedStrategies = [
      {
        scenario: "기본 역량",
        question: `${company}의 비즈니스 모델에서 ${jobTitle}이 해결해야 할 가장 큰 과제는 무엇일까요?`,
        intent: "관심도 및 비즈니스 이해도 검증",
        best_answer_tip: "회사의 수익 구조와 기술의 연결고리를 설명하세요."
      }
    ];
  }

  return { ...baseGuide, strategies: selectedStrategies };
};

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
