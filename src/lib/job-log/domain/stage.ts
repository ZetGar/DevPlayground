import { Stage, Application, StageStats } from "../types";

export const STAGES: Stage[] = [
  "서류",
  "1차면접",
  "2차면접",
  "최종",
  "합격",
  "불합격",
];

export const STAGE_COLOR: Record<Stage, string> = {
  서류: "#6366f1",
  "1차면접": "#3b82f6",
  "2차면접": "#8b5cf6",
  최종: "#f59e0b",
  합격: "#10b981",
  불합격: "#ef4444",
};

// 단계별 그룹핑
export function groupByStage(applications: Application[]): Record<Stage, Application[]> {
  return STAGES.reduce((acc, stage) => {
    acc[stage] = applications.filter((a) => a.stage === stage);
    return acc;
  }, {} as Record<Stage, Application[]>);
}

// 전환율 계산
export function calcStageStats(applications: Application[]): StageStats[] {
  const grouped = groupByStage(applications);

  return STAGES.map((stage, i) => {
    const count = grouped[stage].length;
    const prevStage = STAGES[i - 1];
    const prevCount = prevStage ? grouped[prevStage].length : null;

    return {
      stage,
      count,
      conversionRate:
        prevCount && prevCount > 0
          ? Math.round((count / prevCount) * 100)
          : undefined,
    };
  });
}

// D-day 계산
export function calcDday(deadline?: string): string | null {
  if (!deadline) return null;
  const diff = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return "마감";
  if (diff === 0) return "D-day";
  return `D-${diff}`;
}
