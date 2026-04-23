import { Job } from "@/types/jog-log/job";

export const dummyData: Job[] = [
  {
    id: "1",
    company_name: "Google",
    job_title: "Frontend Developer",
    domain: "Search/Platform",
    company_size: "대기업",
    stage: "서류",
    applied_at: "2024-03-01",
    created_at: new Date().toISOString(),
    user_id: "guest-user",
    ai_guide: {
      checkpoints: [
        { id: 1, task: "Google Search의 렌더링 성능 최적화 사례 조사", done: false },
        { id: 2, task: "Web Vitals 핵심 지표와 개선 방법 정리", done: true },
        { id: 3, task: "크롬 개발자 도구를 활용한 메모리 누수 진단법 복기", done: false },
      ],
      expected_questions: [
        "브라우저의 렌더링 과정을 상세히 설명해주세요.",
        "대규모 트래픽이 발생하는 서비스에서 성능을 어떻게 모니터링하시겠습니까?",
        "HTTP/2와 HTTP/3의 차이점은 무엇이며 프론트엔드에 어떤 영향을 주나요?"
      ],
      tip: "구글은 기술적 원리에 대한 깊은 이해(CS 기초)를 중요하게 봅니다. 단순히 도구 사용법보다는 '왜' 그렇게 동작하는지에 집중하세요.",
      strategies: [
        {
          scenario: "기술적 깊이",
          question: "React의 Virtual DOM이 성능상 항상 유리하다고 생각하시나요?",
          intent: "기술의 트레이드오프를 이해하고 라이브러리 맹신을 경계하는지 확인",
          best_answer_tip: "무조건 좋다는 답변보다, DOM 조작이 적은 단순 페이지에서는 일반 DOM이 더 빠를 수 있음을 언급하며 메모리 사용량과의 관계를 설명하세요."
        },
        {
          scenario: "문제 해결",
          question: "배포된 웹사이트에서 갑자기 발생한 성능 저하를 어떻게 추적하시겠습니까?",
          intent: "디버깅 프로세스와 성능 지표 분석 능력 측정",
          best_answer_tip: "Lighthouse, 실시간 유저 모니터링(RUM) 데이터를 언급하고, 최근 배포된 PR을 역추적하여 리소스 병목 지점을 찾는 과정을 논리적으로 설명하세요."
        }
      ]
    }
  },
  {
    id: "2",
    company_name: "Netflix",
    job_title: "React Engineer",
    domain: "Streaming/OTT",
    company_size: "대기업",
    stage: "불합격",
    applied_at: "2024-03-05",
    created_at: new Date().toISOString(),
    user_id: "guest-user",
    ai_guide: {
      checkpoints: [
        { id: 1, task: "넷플릭스의 'Falcor' 및 데이터 패칭 최적화 사례 공부", done: true },
        { id: 2, task: "저사양 디바이스(TV 등)에서의 React 성능 최적화 전략", done: false },
      ],
      expected_questions: [
        "React 최적화를 위해 시도해본 가장 고난도의 기술은 무엇인가요?",
        "글로벌 서비스에서 다국어 처리(i18n)와 시간대 처리를 어떻게 관리하시겠습니까?"
      ],
      tip: "넷플릭스는 자유와 책임(Culture Memo)을 강조합니다. 본인의 기술적 결정이 비즈니스 효율성에 어떤 기여를 했는지 강조하는 것이 좋습니다.",
      strategies: [
        {
          scenario: "기술적 도전",
          question: "수만 개의 영상 썸네일을 목록에 렌더링할 때 발생하는 버벅임을 어떻게 해결하시겠습니까?",
          intent: "대량의 데이터 렌더링 성능 최적화 경험 확인",
          best_answer_tip: "Windowing 기술(react-window 등)을 통한 DOM 노드 최소화와 이미지 레이지 로딩, Web Worker를 이용한 데이터 전처리 방안을 답변하세요."
        }
      ]
    }
  },
  {
    id: "3",
    company_name: "Amazon",
    job_title: "Software Engineer",
    domain: "E-Commerce",
    company_size: "대기업",
    stage: "합격",
    applied_at: "2024-03-10",
    created_at: new Date().toISOString(),
    user_id: "guest-user",
    ai_guide: {
      checkpoints: [
        { id: 1, task: "아마존의 리더십 원칙(Leadership Principles) 사례 매칭", done: true },
        { id: 2, task: "장바구니 및 결제 로직에서의 데이터 정합성 보장 방안 정리", done: true },
      ],
      expected_questions: [
        "고객 중심(Customer Obsession)을 실천하기 위해 기술적으로 노력한 사례가 있나요?",
        "마이크로 프론트엔드 아키텍처의 장단점에 대해 설명해주세요."
      ],
      tip: "아마존은 'Leadership Principles'에 기반한 행동 질문(Behavioral Questions)이 매우 중요합니다. 모든 답변을 STAR 기법으로 준비하세요.",
      strategies: [
        {
          scenario: "협업과 갈등",
          question: "동료의 코드 리뷰 결과가 본인의 생각과 강하게 대립한다면 어떻게 하시겠습니까?",
          intent: "의견 차이를 조율하는 커뮤니케이션 능력과 유연함 측정",
          best_answer_tip: "주관적인 취향보다는 성능 수치나 공식 문서를 근거로 논의하되, 팀의 컨벤션과 최종 의사결정권자의 판단을 존중하며 빠르게 합의점을 찾는 태도를 보여주세요."
        }
      ]
    }
  },
  {
    id: "4",
    company_name: "토스",
    job_title: "Frontend Developer",
    domain: "Fintech",
    company_size: "유니콘",
    stage: "면접",
    applied_at: "2024-03-15",
    created_at: new Date().toISOString(),
    user_id: "guest-user",
    ai_guide: {
      checkpoints: [
        { id: 1, task: "토스의 '간편함'을 유지하기 위한 프론트엔드 UX 설계 철학 분석", done: false },
        { id: 2, task: "금융 도메인의 보안 및 무결성 처리 로직 복기", done: false },
        { id: 3, task: "Toss Design System(TDS) 라이브러리 활용법 및 컴포넌트 추상화 공부", done: true },
      ],
      expected_questions: [
        "복잡한 금융 데이터 스키마를 프론트엔드 상태 관리에 어떻게 효율적으로 담으셨나요?",
        "토스 앱의 UX 중 개선하고 싶은 기술적 포인트가 있나요?"
      ],
      tip: "토스는 사용자 중심의 제품 사고(Product Thinking)를 극도로 중요하게 여깁니다. 기술 구현이 사용자에게 어떤 가치를 주었는지 강조하세요.",
      strategies: [
        {
          scenario: "사용자 경험",
          question: "송금 과정에서 0.5초의 지연이 발생한다면 어떤 UX 처리를 하시겠습니까?",
          intent: "금융 앱의 신뢰성을 기술적으로 어떻게 보장하는지 확인",
          best_answer_tip: "단순한 스피너보다는 '낙관적 업데이트' 가능 여부를 판단하거나, 송금 완료 전 단계별 상태를 명확히 보여주어 심리적 불안을 해소하겠다고 답하세요."
        },
        {
          scenario: "도메인 특수성",
          question: "사용자의 중요한 금융 정보를 프론트엔드에서 다룰 때 가장 주의하는 점은 무엇인가요?",
          intent: "보안 의식과 에러 핸들링 능력 확인",
          best_answer_tip: "메모리 상의 민감 정보 관리, XSS/CSRF 방어, 그리고 API 에러 시 사용자가 중복 결제를 하지 않도록 멱등성을 고려한 처리 등을 언급하세요."
        }
      ]
    }
  }
];