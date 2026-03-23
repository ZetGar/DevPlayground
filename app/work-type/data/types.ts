export type WorkTypeCode =
    | "PSQ" | "PSD" | "PTQ" | "PTD"
    | "ISQ" | "ISD" | "ITQ" | "ITD";

export type WorkType = {
    code: WorkTypeCode;
    emoji: string;
    name: string;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    environment: string;
};

export const workTypes: Record<WorkTypeCode, WorkType> = {
    PSQ: {
        code: "PSQ",
        emoji: "🏰",
        name: "전략가",
        summary: "3개월치 계획을 엑셀로 관리합니다",
        strengths: [
            "체계적인 계획 수립 능력",
            "혼자서도 높은 집중력 유지",
            "완성도에 대한 높은 기준",
        ],
        weaknesses: [
            "갑작스러운 변화에 적응이 느림",
            "완벽주의로 인한 번아웃 위험",
        ],
        environment: "조용한 환경에서 혼자 집중할 수 있는 공간",
    },
    PSD: {
        code: "PSD",
        emoji: "🌿",
        name: "조용한 완성자",
        summary: "말없이 제일 먼저 끝냅니다",
        strengths: [
            "계획대로 묵묵히 실행하는 추진력",
            "혼자서도 높은 생산성",
            "기한 내 완성을 최우선으로",
        ],
        weaknesses: [
            "결과물에 아쉬움이 남을 수 있음",
            "소통이 부족해 보일 수 있음",
        ],
        environment: "명확한 목표와 데드라인이 있는 환경",
    },
    PTQ: {
        code: "PTQ",
        emoji: "🔬",
        name: "완벽한 리더",
        summary: "팀 전체가 완벽해야 합니다",
        strengths: [
            "팀 전체의 완성도를 높이는 리더십",
            "체계적인 프로세스 설계 능력",
            "꼼꼼한 피드백과 리뷰",
        ],
        weaknesses: [
            "높은 기준으로 팀원에게 부담이 될 수 있음",
            "의사결정이 느려질 수 있음",
        ],
        environment: "명확한 기준과 프로세스가 있는 팀",
    },
    PTD: {
        code: "PTD",
        emoji: "🗺️",
        name: "탐험가",
        summary: "방향만 잡고 같이 달립니다",
        strengths: [
            "팀원과 함께 빠르게 실행하는 추진력",
            "유연한 적응력과 방향 전환 능력",
            "함께하는 과정에서 동기 부여",
        ],
        weaknesses: [
            "계획이 부족해 방향을 잃을 수 있음",
            "결과물의 완성도가 들쭉날쭉할 수 있음",
        ],
        environment: "자율성이 보장되는 팀 프로젝트 환경",
    },
    ISQ: {
        code: "ISQ",
        emoji: "🎯",
        name: "실행머신",
        summary: "일단 시작하고 생각은 나중에",
        strengths: [
            "빠른 실행력과 추진력",
            "혼자서도 몰입해서 완성하는 능력",
            "높은 완성도를 향한 집념",
        ],
        weaknesses: [
            "계획 없이 시작해 방향을 잃을 수 있음",
            "완벽주의로 인해 시작이 어려울 때도 있음",
        ],
        environment: "자유롭게 실험하고 혼자 집중할 수 있는 환경",
    },
    ISD: {
        code: "ISD",
        emoji: "💨",
        name: "질주자",
        summary: "완성이 곧 완벽입니다",
        strengths: [
            "누구보다 빠른 실행력",
            "완성에 집중하는 실용적인 사고",
            "압박 상황에서도 흔들리지 않음",
        ],
        weaknesses: [
            "품질보다 속도를 우선시할 수 있음",
            "계획 없이 진행해 수정이 잦을 수 있음",
        ],
        environment: "빠른 피드백과 반복이 가능한 환경",
    },
    ITQ: {
        code: "ITQ",
        emoji: "🎨",
        name: "크리에이터",
        summary: "영감이 올 때 팀 전체가 달립니다",
        strengths: [
            "창의적인 아이디어와 에너지",
            "팀 전체에 동기를 부여하는 능력",
            "높은 완성도를 추구하는 열정",
        ],
        weaknesses: [
            "영감이 없을 때 생산성이 낮아질 수 있음",
            "즉흥적인 방향 전환이 팀에 혼란을 줄 수 있음",
        ],
        environment: "창의성과 자율성이 존중받는 팀",
    },
    ITD: {
        code: "ITD",
        emoji: "🎪",
        name: "파티플래너",
        summary: "회의 중에 아이디어가 터집니다",
        strengths: [
            "즉흥적이고 에너지 넘치는 아이디어",
            "팀 분위기를 살리는 소통 능력",
            "빠른 실행과 완성에 집중",
        ],
        weaknesses: [
            "체계적인 계획이 부족할 수 있음",
            "완성도보다 재미를 우선시할 수 있음",
        ],
        environment: "자유롭고 활기찬 팀 문화",
    },
};