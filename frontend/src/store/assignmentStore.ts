import { create } from "zustand";
import type { Assignment, AssignmentFormData } from "@/types/assignment";

const defaultForm: AssignmentFormData = {
  title: "",
  subject: "",
  dueDate: "",
  questionTypes: [],
  numberOfQuestions: 10,
  totalMarks: 50,
  additionalInstructions: "",
  file: null,
};

interface AssignmentState {
  form: AssignmentFormData;
  assignments: Assignment[];
  currentAssignment: Assignment | null;
  isSubmitting: boolean;
  setFormField: <K extends keyof AssignmentFormData>(
    key: K,
    value: AssignmentFormData[K]
  ) => void;
  resetForm: () => void;
  setAssignments: (items: Assignment[]) => void;
  setCurrentAssignment: (item: Assignment | null) => void;
  setSubmitting: (v: boolean) => void;
  toggleQuestionType: (type: string) => void;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  form: { ...defaultForm },
  assignments: [],
  currentAssignment: null,
  isSubmitting: false,

  setFormField: (key, value) =>
    set((state) => ({ form: { ...state.form, [key]: value } })),

  resetForm: () => set({ form: { ...defaultForm } }),

  setAssignments: (items) => set({ assignments: items }),

  setCurrentAssignment: (item) => set({ currentAssignment: item }),

  setSubmitting: (v) => set({ isSubmitting: v }),

  toggleQuestionType: (type) =>
    set((state) => {
      const types = state.form.questionTypes.includes(type)
        ? state.form.questionTypes.filter((t) => t !== type)
        : [...state.form.questionTypes, type];
      return { form: { ...state.form, questionTypes: types } };
    }),
}));
