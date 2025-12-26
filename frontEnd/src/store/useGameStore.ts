import { create } from 'zustand';
import type { Question, Stat } from '../lib/types';

type GameState = {
  currentQuestion: Question | null;
  results: Stat[] | null;
  loading: boolean;

  setQuestion: (q: Question | null) => void;
  setResults: (r: Stat[] | null) => void;
  setLoading: (v: boolean) => void;
};

export const useGameStore = create<GameState>((set) => ({
  currentQuestion: null,
  results: null,
  loading: false,

  setQuestion: (q) => set({ currentQuestion: q, results: null }),
  setResults: (r) => set({ results: r }),
  setLoading: (v) => set({ loading: v }),
}));
