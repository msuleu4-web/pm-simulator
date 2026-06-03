import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'pm-learning-progress';
const STORAGE_SCORE_KEY = 'pm-quiz-results';

export type LearningProgress = Record<string, { learnedAt: string }>;
export type QuizResults = Record<string, { score: number; at: string; attempts: number }>;

export type LearningProgressContextValue = {
  progress: LearningProgress;
  markLearned: (term: string) => void;
  unmarkLearned: (term: string) => void;
  isLearned: (term: string) => boolean;
  count: number;
  setScore: (term: string, score: number) => void;
  getScore: (term: string) => QuizResults[string] | undefined;
  scores: QuizResults;
};

const LearningProgressContext = createContext<LearningProgressContextValue | undefined>(undefined);

export function LearningProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<LearningProgress>({});
  const [scores, setScores] = useState<QuizResults>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setProgress(JSON.parse(raw));
    } catch {
      // ignore
    }
    try {
      const raw2 = window.localStorage.getItem(STORAGE_SCORE_KEY);
      if (raw2) setScores(JSON.parse(raw2));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_SCORE_KEY, JSON.stringify(scores));
    } catch {
      // ignore
    }
  }, [scores]);

  const markLearned = (term: string) => {
    setProgress((p) => ({ ...p, [term]: { learnedAt: new Date().toISOString() } }));
  };

  const unmarkLearned = (term: string) => {
    setProgress((p) => {
      const copy = { ...p };
      delete copy[term];
      return copy;
    });
  };

  const isLearned = (term: string) => !!progress[term];

  const setScore = (term: string, score: number) => {
    setScores((s) => {
      const prev = s[term];
      const attempts = (prev?.attempts ?? 0) + 1;
      return { ...s, [term]: { score, at: new Date().toISOString(), attempts } };
    });
  };

  const getScore = (term: string) => scores[term];

  const count = Object.keys(progress).length;

  return (
    <LearningProgressContext.Provider
      value={{ progress, markLearned, unmarkLearned, isLearned, count, setScore, getScore, scores }}
    >
      {children}
    </LearningProgressContext.Provider>
  );
}

export function useLearningProgress() {
  const context = useContext(LearningProgressContext);
  if (!context) {
    throw new Error('useLearningProgress must be used within LearningProgressProvider');
  }
  return context;
}

export default useLearningProgress;
