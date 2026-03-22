import { Segment, Campaign, ExecutionLog } from "./types";

const g = globalThis as unknown as {
  segments: Segment[];
  campaigns: Campaign[];
  executionLogs: ExecutionLog[];
};

export const segments =
  g.segments ?? (g.segments = []);

export const campaigns =
  g.campaigns ?? (g.campaigns = []);

export const executionLogs =
  g.executionLogs ?? (g.executionLogs = []);