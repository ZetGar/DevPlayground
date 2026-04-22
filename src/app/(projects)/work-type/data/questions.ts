export type OptionScore = 2 | 1 | 0;

export type Option = {
    label: string;
    score: OptionScore;
};

export type Question = {
    id: number;
    axis: "A" | "B" | "C";
    text: string;
    options: Option[];
};

export const questions: Question[] = [
    // ── A축: 계획형(P=2) vs 즉흥형(I=0) ──
    {
        id: 1,
        axis: "A",
        text: "새 프로젝트/업무 시작 전 나는?",
        options: [
            { label: "전체 흐름을 먼저 정리하고 시작한다", score: 2 },
            { label: "대략적인 방향만 잡고 시작한다", score: 1 },
            { label: "일단 시작하면서 방향을 잡는다", score: 0 },
            { label: "시작하는 게 곧 계획이다", score: 0 },
        ],
    },
    {
        id: 2,
        axis: "A",
        text: "갑작스러운 일정 변경이 생기면?",
        options: [
            { label: "전체 계획을 다시 짠다", score: 2 },
            { label: "당황스럽지만 금방 적응한다", score: 1 },
            { label: "오히려 새로운 방향이 생겨서 설렌다", score: 0 },
            { label: "변경이 뭐? 원래 유동적으로 했는데", score: 0 },
        ],
    },
    {
        id: 3,
        axis: "A",
        text: "하루 시작할 때 나는?",
        options: [
            { label: "오늘 할 일 목록을 먼저 작성한다", score: 2 },
            { label: "어제 하던 것부터 이어서 한다", score: 1 },
            { label: "그냥 눈에 보이는 것부터 한다", score: 0 },
            { label: "오늘 기분에 따라 다르다", score: 0 },
        ],
    },
    {
        id: 4,
        axis: "A",
        text: "여행 간다면?",
        options: [
            { label: "일정표 + 예약 다 미리 한다", score: 2 },
            { label: "숙소만 잡고 나머지는 현지에서", score: 1 },
            { label: "비행기 티켓만 끊고 간다", score: 0 },
            { label: "즉흥 여행이 진짜 여행이다", score: 0 },
        ],
    },

    // ── B축: 혼자형(S=2) vs 함께형(T=0) ──
    {
        id: 5,
        axis: "B",
        text: "어려운 문제를 만났을 때?",
        options: [
            { label: "혼자 끝까지 파고든다", score: 2 },
            { label: "일단 혼자 해보다가 막히면 물어본다", score: 1 },
            { label: "바로 주변에 물어본다", score: 0 },
            { label: "같이 머리 맞대는 게 더 빠르다", score: 0 },
        ],
    },
    {
        id: 6,
        axis: "B",
        text: "가장 집중이 잘 되는 환경은?",
        options: [
            { label: "혼자 조용한 공간", score: 2 },
            { label: "카페처럼 적당한 소음", score: 1 },
            { label: "옆에 누군가 있으면 더 잘 된다", score: 0 },
            { label: "팀원들이랑 같은 공간에 있을 때", score: 0 },
        ],
    },
    {
        id: 7,
        axis: "B",
        text: "좋은 아이디어가 생기면?",
        options: [
            { label: "혼자 더 발전시키고 나서 공유한다", score: 2 },
            { label: "어느 정도 정리되면 공유한다", score: 1 },
            { label: "바로 주변에 말하면서 같이 발전시킨다", score: 0 },
            { label: "말하는 순간 아이디어가 완성된다", score: 0 },
        ],
    },
    {
        id: 8,
        axis: "B",
        text: "잘했다는 느낌이 드는 순간은?",
        options: [
            { label: "혼자 끝낸 결과물을 볼 때", score: 2 },
            { label: "결과가 좋을 때", score: 1 },
            { label: "팀원한테 '덕분에'라는 말 들을 때", score: 0 },
            { label: "다같이 끝냈을 때", score: 0 },
        ],
    },

    // ── C축: 완벽주의(Q=2) vs 완성주의(D=0) ──
    {
        id: 9,
        axis: "C",
        text: "마감이 2시간 남았는데 아직 부족하다면?",
        options: [
            { label: "마감 연장을 요청한다", score: 2 },
            { label: "핵심만 완성하고 나머지는 다음에", score: 1 },
            { label: "지금 있는 걸로 제출한다", score: 0 },
            { label: "2시간이면 충분하다", score: 0 },
        ],
    },
    {
        id: 10,
        axis: "C",
        text: "남이 내 결과물을 볼 때?",
        options: [
            { label: "부족한 부분이 먼저 보여서 불안하다", score: 2 },
            { label: "좀 떨리지만 괜찮다", score: 1 },
            { label: "일단 보여주고 피드백 받으면 된다", score: 0 },
            { label: "보여주기 전까지 완성이 아니다", score: 0 },
        ],
    },
    {
        id: 11,
        axis: "C",
        text: "예전에 만든 결과물을 다시 보면?",
        options: [
            { label: "고치고 싶은 게 한가득이다", score: 2 },
            { label: "아쉽지만 그때는 최선이었다", score: 1 },
            { label: "그때 완성한 게 대단하다", score: 0 },
            { label: "잘 기억도 안 난다", score: 0 },
        ],
    },
    {
        id: 12,
        axis: "C",
        text: "나에게 '좋은 결과물'이란?",
        options: [
            { label: "더 이상 고칠 게 없는 것", score: 2 },
            { label: "기대치를 넘은 것", score: 1 },
            { label: "기한 내에 목적을 달성한 것", score: 0 },
            { label: "일단 세상에 나온 것", score: 0 },
        ],
    },
];