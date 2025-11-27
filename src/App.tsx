import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import RefinementWizard from './components/RefinementWizard';
import DiagnosisView from './components/DiagnosisView';
import ProgressBar from './components/ProgressBar';
import { AppState, FormData, InitialAnalysisResult, Question, FinalDiagnosis } from './types';
import { analyzeInitialSymptoms, finalizeDiagnosis } from './services/geminiService';

const INITIAL_FORM_DATA: FormData = {
  plantType: '',
  environment: '',
  symptoms: '',
  selectedSymptoms: [],
  evolutionTime: '',
  recentConditions: [],

};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.FORM);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [initialAnalysis, setInitialAnalysis] = useState<InitialAnalysisResult | null>(null);
  const [finalResult, setFinalResult] = useState<FinalDiagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInitialSubmit = async () => {
    setError(null);
    setState(AppState.ANALYZING_INITIAL);
    try {
      const result = await analyzeInitialSymptoms(formData);
      setInitialAnalysis(result);
      setState(AppState.REFINEMENT);
    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro ao analisar os dados. Verifique sua conexão ou a chave de API.");
      setState(AppState.FORM);
    }
  };

  const handleRefinementComplete = async (answeredQuestions: Question[]) => {
    if (!initialAnalysis) return;
    setError(null);
    setState(AppState.ANALYZING_FINAL);
    try {
      const result = await finalizeDiagnosis(formData, initialAnalysis, answeredQuestions);
      setFinalResult(result);
      setState(AppState.DETAIL_VIEW);
    } catch (err) {
      console.error(err);
      setError("Erro ao gerar o diagnóstico final. Tente novamente.");
      setState(AppState.REFINEMENT);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setInitialAnalysis(null);
    setFinalResult(null);
    setError(null);
    setState(AppState.FORM);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light font-display">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {state === AppState.FORM && (
          <div className="w-full space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-black tracking-tighter text-text-main sm:text-5xl">Inicie o Diagnóstico da sua Planta</h2>
              <p className="mt-3 text-lg text-text-muted">Siga os passos abaixo para nos ajudar a entender o problema.</p>
            </div>
            <ProgressBar
              currentStep={1}
              totalSteps={3}
              labels={['Sobre a Planta', 'Descrição do Problema', 'Análise Visual']}
            />
            <InputForm
              data={formData}
              onChange={setFormData}
              onSubmit={handleInitialSubmit}
              isSubmitting={false}
            />
          </div>
        )}

        {state === AppState.ANALYZING_INITIAL && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-pulse">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-medium text-text-muted">Analisando sintomas e gerando hipóteses...</p>
          </div>
        )}

        {state === AppState.REFINEMENT && initialAnalysis && (
          <RefinementWizard
            questions={initialAnalysis.questions}
            onComplete={handleRefinementComplete}
            isSubmitting={false}
          />
        )}

        {state === AppState.ANALYZING_FINAL && (
          <RefinementWizard
            questions={initialAnalysis?.questions || []}
            onComplete={() => { }}
            isSubmitting={true}
          />
        )}

        {state === AppState.DETAIL_VIEW && finalResult && (
          <DiagnosisView diagnosis={finalResult} onReset={handleReset} />
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6 rounded shadow-sm text-center" role="alert">
            <p className="font-bold">Erro</p>
            <p>{error}</p>
          </div>
        )}

      </main>

      <footer className="w-full py-4 text-center text-sm text-text-muted border-t border-gray-200">
        <p>MDH - @copywrite - 2025 - versão 1.0. Desenvolvido por Pvolker</p>
      </footer>
    </div>
  );
};

export default App;