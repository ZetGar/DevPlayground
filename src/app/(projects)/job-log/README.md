📑 Job Log (AI 면접 전략 파트너)
"무분별한 지원을 넘어, 전략적인 합격으로" > AI를 통해 채용 공고를 분석하고, 도메인 맞춤형 질문과 나만의 오답 노트를 관리하는 면접 대비 플랫폼입니다.

🚀 주요 기능 (Key Features)
1. ✨ AI 채용 공고 분석 (Job Analysis)
자동 정보 추출: 채용 공고 URL 입력 시 AI가 회사명, 포지션, 비즈니스 도메인을 자동으로 파악합니다.

맞춤형 인터뷰 가이드: 분석된 도메인(핀테크, 커머스 등)을 바탕으로 면접관의 질문 의도와 Best Answer Tip을 포함한 5가지 핵심 질문을 생성합니다.

2. 📝 나만의 면접 오답 노트 (Interview Notes) - In Progress
STAR 기법 답변 작성: 질문별로 상황(S), 과제(T), 행동(A), 결과(R)에 맞춘 체계적인 답변 작성을 지원합니다.

키워드 리마인드: 면접 직전 빠르게 복기할 수 있도록 답변별 핵심 키워드 태깅 기능을 제공합니다.

공통 질문 마스터: 어느 면접에서나 나오는 필수 질문(자기소개, 지원동기 등)을 별도로 관리할 수 있습니다.

3. 🧪 체험 모드 (Guest Mode)
로그인 없는 경험: 비회원도 LocalStorage를 활용해 모든 기능을 즉시 체험해 볼 수 있습니다. (포트폴리오 시연 최적화)

🛠 Tech Stack
Frontend: Next.js 14 (App Router), TypeScript, React

Backend/DB: Supabase (Auth, Database)

AI Engine: Custom Prompting Logic (Domain-specific strategy library)

Styling: CSS Modules

🏗️ Architecture & Logic
도메인 기반 전략 주입
단순한 텍스트 생성이 아니라, 금융/커머스/물류 등 각 산업군에 특화된 기술적 레이스 컨디션, 성능 최적화 이슈 등을 전략 라이브러리(strategyLibrary)에서 매칭하여 높은 전문성을 제공합니다.

비회원 데이터 영속성
GuestStorage 클래스를 설계하여 비회원의 데이터를 브라우저 내에 안전하게 관리하며, 회원 전환 시 데이터 마이그레이션이 용이한 구조로 설계되었습니다.

💡 기획 의도 및 회고
Problem: 많은 지원자가 공고의 비즈니스 도메인에 대한 이해 없이 면접에 임하여 기술 질문에 적절히 대응하지 못하는 문제를 발견했습니다.

Solution: AI가 공고의 핵심 도메인을 먼저 짚어주고, 그에 맞는 '진짜 나올 법한' 심화 질문을 던져줌으로써 지원자의 실질적인 면접 합격률을 높이고자 했습니다.

💻 실행 방법 (Getting Started)
Bash
# 저장소 복제
git clone https://github.com/your-repo/job-log.git

# 패키지 설치
npm install

# 환경 변수 설정 (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# 개발 서버 실행
npm run dev