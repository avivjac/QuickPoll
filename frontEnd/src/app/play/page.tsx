'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import QuestionView from '@/components/questionsView';
import { ResultsView } from '@/components/ResultsView';
import { apiGet, apiPost } from '@/lib/api';

export default function PlayPage() {
  const { currentQuestion, results, setQuestion, setResults, loading, setLoading } =
    useGameStore();

  async function loadNextQuestion() {
    setLoading(true);
    try {
      const q = await apiGet('/questions/next');
      setQuestion(q);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer(optionId: number) {
    if (!currentQuestion) return;
    setLoading(true);
    try {
      const res = await apiPost('/answers', {
        questionId: currentQuestion.id,
        optionId,
      });
      setResults(res.results); // פורמט מה-BE
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNextQuestion();
  }, []);

  if (loading && !currentQuestion) {
    return <div className="text-center p-10">טוען שאלה...</div>;
  }

  if (!currentQuestion) {
    return (
      <div className="text-center p-10">
        אין עוד שאלות כרגע.
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6">
      <QuestionView question={currentQuestion} onSelectOption={submitAnswer} />

      {results && (
        <>
          <ResultsView stats={results} />
          <button
            onClick={loadNextQuestion}
            className="mt-4 px-6 py-2 rounded-full border text-lg"
          >
            שאלה הבאה
          </button>
        </>
      )}
    </main>
  );
}
