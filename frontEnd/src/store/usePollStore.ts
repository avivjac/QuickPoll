import { create } from 'zustand';
import { Question, Stat } from '@/lib/types';

interface PollState {
  currentQuestion: Question | null;
  isLoading: boolean;
  error: string | null;
  stats: Stat[] | null;
  hasVoted: boolean;

  fetchNextQuestion: () => Promise<void>;
  submitAnswer: (userId: string, questionId: number, optionId: number) => Promise<void>;
  reset: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const usePollStore = create<PollState>((set) => ({
  currentQuestion: null,
  isLoading: false,
  error: null,
  stats: null,
  hasVoted: false,

  fetchNextQuestion: async () => {
    set({ isLoading: true, error: null, hasVoted: false, stats: null });
    try {
      const response = await fetch(`${API_URL}/questions/next`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No more questions available');
        }
        throw new Error('Failed to fetch question');
      }
      const data = await response.json();
      set({ currentQuestion: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  submitAnswer: async (userId: string, questionId: number, optionId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          question_id: questionId,
          option_id: optionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const data = await response.json();
      set({ stats: data.stats, hasVoted: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  reset: () => set({ currentQuestion: null, stats: null, hasVoted: false, error: null })
}));
