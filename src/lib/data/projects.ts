export const projects = [
  {
    number: "Project 1",
    title: "Behavior-Based Marketing Automation",
    description:
      "유저 이벤트를 수집해 시간 감쇠(decay) 기반 score로 상태를 자동 분류하고, 세그먼트별 캠페인을 자동 실행하는 마케팅 자동화 시스템",
    status: "완료" as const,
    tags: ["Next.js", "TypeScript", "Node.js", "Supabase", "REST API"],
    path: "/activity-tracker",
    outputs: ["이벤트 수집 → 상태 자동 분류", "세그먼트 기반 캠페인 자동 실행", "전환율 추적 대시보드"],
    color: "blue",
  },
  {
    number: "Project 2",
    title: "AI 커리어 트래커 (JobLog)",
    description:
      "지원 데이터가 쌓일수록 AI가 합격 패턴을 분석하고 커리어 방향을 가이드해주는 스마트 채용 트래커",
    status: "진행중" as const,
    tags: ["Next.js", "TypeScript", "Supabase", "Claude API"],
    path: "/job-log",
    outputs: ["합격 패턴 분석", "커리어 방향 가이드", "AI 기업 추천"],
    color: "emerald",
  },
  {
    number: "Project 3",
    title: "ThinkMap (AI 마인드맵)",
    description:
      "두서없이 떠오르는 생각을 자유롭게 적으면, AI가 핵심 키워드와 관계를 분석하여 구조화된 마인드맵으로 자동 정리해주는 도구",
    status: "진행중" as const,
    tags: ["Next.js", "Claude API", "SVG"],
    path: "/think-map",
    outputs: [
      "AI 기반 생각 구조화 JSON 파싱",
      "SVG 노드 및 연결선 동적 렌더링",
      "마인드맵 이미지 내보내기",
    ],
    color: "blue",
  },
  {
    number: "Side Project 1",
    title: "일잘러 성향 테스트",
    description:
      "실무 상황을 반영한 12가지 문항을 통해, 개인의 업무 스타일을 '크리에이터', '전략가' 등 8가지 페르소나로 분류하고 최적의 업무 환경을 제안",
    status: "완료" as const,
    tags: ["Next.js", "TypeScript", "html2canvas"],
    path: "/work-type",
    outputs: [
      "8가지 업무 유형 상세 리포트",
      "강점·약점 기반의 커스터마이징 가이드",
      "개인별 최적의 업무 환경 추천",
    ],
    color: "violet",
  },
  {
    number: "Side Project 2",
    title: "일잘러 생산성 툴킷",
    description:
      "자주 쓰는 명령어와 템플릿을 관리하는 '치트시트'와 업무의 우선순위를 시각화하는 '아이젠하워 매트릭스'를 통합한 생산성 향상 도구",
    status: "진행중" as const,
    tags: ["Next.js", "Supabase Auth", "dnd-kit"],
    path: "/productivity-kit",
    outputs: [
      "사용자별 커스텀 치트시트 저장소",
      "드래그 앤 드롭 업무 우선순위 관리",
      "기기 간 실시간 데이터 동기화",
    ],
    color: "emerald",
  },
];
