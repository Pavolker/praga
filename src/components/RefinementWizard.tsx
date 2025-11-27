import React, { useEffect, useState } from 'react';
import { Question } from '../types';

// Helper to extract alternatives from a question like "A ou B"
const getAlternatives = (text: string): [string, string] | null => {
  const match = text.match(/([^?]+?)\s+ou\s+([^?]+?)(\?|$)/i);
  if (match) {
    const opt1 = match[1].trim();
    const opt2 = match[2].trim();
    return [opt1, opt2];
  }
  return null;
};

interface RefinementWizardProps {
  questions: Question[];
  onComplete: (answeredQuestions: Question[]) => void;
  isSubmitting: boolean;
}

const RefinementWizard: React.FC<RefinementWizardProps> = ({ questions, onComplete, isSubmitting }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Question[]>(questions);

  useEffect(() => {
    setAnswers(questions);
    setCurrentIndex(0);
  }, [questions]);

  const handleAnswer = (answer: 'yes' | 'no') => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = { ...updatedAnswers[currentIndex], answer };
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentQuestion = answers[currentIndex];
  // Calculate progress based on questions + initial steps. 
  // Screenshot shows "Passo 1 de 4" and "25%". Let's just simulate question progress.
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  if (isSubmitting) {
    return (
      <div className="w-full max-w-xl mx-auto bg-surface-light rounded-xl shadow-sm p-12 flex flex-col items-center text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-bold text-text-main mb-2">Gerando Diagnóstico Final...</h3>
        <p className="text-text-muted">Estamos compilando as melhores soluções para sua planta.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8 animate-fade-in">
      <div className="w-full max-w-xl rounded-xl bg-surface-light shadow-sm">
        <div className="flex flex-col gap-6 p-6 sm:p-8">

          {/* Progress */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text-main">Passo {currentIndex + 1} de {questions.length}</p>
              <p className="text-sm font-semibold text-primary">{progress}%</p>
            </div>
            <div className="h-2 w-full rounded-full bg-border-light">
              <div className="h-2 rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Headline */}
          <div className="flex items-start gap-3">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-text-main sm:text-3xl">
              {currentQuestion.text}
            </h1>
            <button className="mt-1 flex-shrink-0 text-text-muted/50 hover:text-accent" title="Ajuda">
              <span className="material-symbols-outlined text-2xl">help</span>
            </button>
          </div>

          {/* Radio List */}
          <div className="flex flex-col gap-4">
            {(() => {
              const alternatives = getAlternatives(currentQuestion.text);
              const yesLabel = alternatives ? `Sim (${alternatives[0]})` : 'Sim';
              const noLabel = alternatives ? `Não (${alternatives[1]})` : 'Não';
              return (
                <>
                  <label className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 border-solid p-4 transition-all ${currentQuestion.answer === 'yes' ? 'border-primary bg-primary/10' : 'border-border-light'}`}>
                    <input
                      className="h-5 w-5 flex-shrink-0 appearance-none rounded-full border-2 border-border-light bg-transparent text-primary ring-offset-background-light focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 checked:border-primary checked:bg-primary"
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      checked={currentQuestion.answer === 'yes'}
                      onChange={() => handleAnswer('yes')}
                    />
                    <span className="text-base font-medium text-text-main">{yesLabel}</span>
                  </label>
                  <label className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 border-solid p-4 transition-all ${currentQuestion.answer === 'no' ? 'border-primary bg-primary/10' : 'border-border-light'}`}>
                    <input
                      className="h-5 w-5 flex-shrink-0 appearance-none rounded-full border-2 border-border-light bg-transparent text-primary ring-offset-background-light focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 checked:border-primary checked:bg-primary"
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      checked={currentQuestion.answer === 'no'}
                      onChange={() => handleAnswer('no')}
                    />
                    <span className="text-base font-medium text-text-main">{noLabel}</span>
                  </label>
                </>
              );
            })()}
          </div>

          {/* Button Group */}
          <div className="mt-4 flex flex-col-reverse gap-3 border-t border-border-light pt-6 sm:flex-row sm:justify-between">
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="flex h-12 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-border-light/60 px-6 text-base font-bold leading-normal tracking-wide text-text-main transition-colors hover:bg-border-light disabled:opacity-50"
            >
              <span className="truncate">Voltar</span>
            </button>
            <button
              onClick={handleNext}
              disabled={!currentQuestion.answer}
              className="flex h-12 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-6 text-base font-bold leading-normal tracking-wide text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="truncate">{currentIndex === questions.length - 1 ? 'Finalizar' : 'Próximo'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RefinementWizard;
