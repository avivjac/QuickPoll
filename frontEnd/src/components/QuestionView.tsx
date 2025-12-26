'use client';

import { useState } from 'react';
import { usePollStore } from '@/store/usePollStore';
import { OptionImage } from './OptionImage';
import { ResultsView } from './ResultsView';

export function QuestionView() {
    const { currentQuestion, submitAnswer, stats, fetchNextQuestion, isLoading } = usePollStore();
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

    if (!currentQuestion) return null;

    const handleOptionSelect = (optionId: number) => {
        if (stats) return; // Already voted
        setSelectedOptionId(optionId);
    };

    const handleVote = async () => {
        if (!selectedOptionId) return;
        // Generate a proper user identifier in a real app.
        const userId = localStorage.getItem('quickpoll_user_id') || `user_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('quickpoll_user_id', userId);

        await submitAnswer(userId, currentQuestion.id, selectedOptionId);
    };

    const handleNext = () => {
        setSelectedOptionId(null);
        fetchNextQuestion();
    };

    return (
        <div className="max-w-4xl mx-auto w-full px-4 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-10 space-y-2">
                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wider rounded-full uppercase">
                    QuickPoll
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                    {currentQuestion.title}
                </h1>
                {currentQuestion.description && (
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        {currentQuestion.description}
                    </p>
                )}
            </div>

            {!stats ? (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {currentQuestion.options.map((option) => (
                            <OptionImage
                                key={option.id}
                                label={option.label}
                                imageUrl={option.image_url}
                                selected={selectedOptionId === option.id}
                                onClick={() => handleOptionSelect(option.id)}
                                disabled={isLoading}
                            />
                        ))}
                    </div>

                    <div className="flex justify-center pt-4">
                        <button
                            onClick={handleVote}
                            disabled={!selectedOptionId || isLoading}
                            className={`
                px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-500/20
                flex items-center gap-2 transition-all duration-300
                ${!selectedOptionId || isLoading
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed transform-none'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 active:scale-95'
                                }
              `}
                        >
                            {isLoading ? (
                                <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Submit Vote</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-10 animate-in zoom-in-95 duration-500">
                    <ResultsView stats={stats} />

                    <div className="flex justify-center">
                        <button
                            onClick={handleNext}
                            className="
                group px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 
                rounded-full font-bold text-gray-900 dark:text-white
                hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400
                transition-all duration-300 shadow-sm hover:shadow-lg
                flex items-center gap-3
              "
                        >
                            <span>Next Question</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
