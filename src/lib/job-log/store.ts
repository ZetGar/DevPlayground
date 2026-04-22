import { create } from "zustand";
import { Application, AIAnalysis } from "./types";
import {
  getApplications,
  createApplication,
  updateApplication,
  updateStage,
  deleteApplication,
} from "./domain/application";
import { Stage } from "./types";

interface JobLogStore {
  applications: Application[];
  latestAnalysis: AIAnalysis | null;
  isLoading: boolean;

  fetchApplications: () => Promise<void>;
  addApplication: (input: Omit<Application, "id" | "createdAt">) => Promise<void>;
  editApplication: (id: string, input: Partial<Omit<Application, "id" | "createdAt">>) => Promise<void>;
  moveStage: (id: string, stage: Stage) => Promise<void>;
  removeApplication: (id: string) => Promise<void>;
  setLatestAnalysis: (analysis: AIAnalysis) => void;
}

export const useJobLogStore = create<JobLogStore>((set) => ({
  applications: [],
  latestAnalysis: null,
  isLoading: false,

  fetchApplications: async () => {
    set({ isLoading: true });
    const applications = await getApplications();
    set({ applications, isLoading: false });
  },

  addApplication: async (input) => {
    const newApp = await createApplication(input);
    set((state) => ({ applications: [newApp, ...state.applications] }));
  },

  editApplication: async (id, input) => {
    const updated = await updateApplication(id, input);
    set((state) => ({
      applications: state.applications.map((a) => (a.id === id ? updated : a)),
    }));
  },

  moveStage: async (id, stage) => {
    await updateStage(id, stage);
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id ? { ...a, stage } : a
      ),
    }));
  },

  removeApplication: async (id) => {
    await deleteApplication(id);
    set((state) => ({
      applications: state.applications.filter((a) => a.id !== id),
    }));
  },

  setLatestAnalysis: (analysis) => set({ latestAnalysis: analysis }),
}));
