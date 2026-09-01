import { create } from "zustand";
import type { MCQQuestion } from "@/types";

interface PollState {
  item: string;
  paper: string;
  subitem: string;
  standard: string;
  questionLimit: number;
  activeQuestions: readonly MCQQuestion[];
  userAnswers: { [qIdx: number]: number };
  currentQuestionIndex: number;

  setItem: (item: string) => void;
  setPaper: (paper: string) => void;
  setSubitem: (subitem: string) => void;
  setStandard: (standard: string) => void;
  setQuestionLimit: (limit: number) => void;
  setActiveQuestions: (questions: readonly MCQQuestion[]) => void;
  setUserAnswers: (
    answers:
      | { [qIdx: number]: number }
      | ((prev: { [qIdx: number]: number }) => { [qIdx: number]: number }),
  ) => void;
  setCurrentQuestionIndex: (index: number | ((prev: number) => number)) => void;

  resetPoll: () => void;
}

export const usePollStore = create<PollState>((set) => ({
  item: "physics",
  paper: "1st",
  subitem: "",
  standard: "board",
  questionLimit: 10,
  activeQuestions: [],
  userAnswers: {},
  currentQuestionIndex: 0,

  setItem: (item) => set({ item }),
  setPaper: (paper) => set({ paper }),
  setSubitem: (subitem) => set({ subitem }),
  setStandard: (standard) => set({ standard }),
  setQuestionLimit: (questionLimit) => set({ questionLimit }),
  setActiveQuestions: (activeQuestions) => set({ activeQuestions }),
  setUserAnswers: (updater) =>
    set((state) => ({
      userAnswers:
        typeof updater === "function" ? updater(state.userAnswers) : updater,
    })),
  setCurrentQuestionIndex: (updater) =>
    set((state) => ({
      currentQuestionIndex:
        typeof updater === "function"
          ? updater(state.currentQuestionIndex)
          : updater,
    })),

  resetPoll: () =>
    set({ activeQuestions: [], userAnswers: {}, currentQuestionIndex: 0 }),
}));
