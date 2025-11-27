import React from 'react';
import { FinalDiagnosis } from '../types';

interface DiagnosisViewProps {
  diagnosis: FinalDiagnosis;
  onReset: () => void;
}

const DiagnosisView: React.FC<DiagnosisViewProps> = ({ diagnosis, onReset }) => {
  const { mainDiagnosis, secondaryDiagnosis, immediateActions, culturalActions, homeRecipes, prevention, technicalHelpTrigger } = diagnosis;

  return (
    <div className="flex flex-col max-w-4xl mx-auto flex-1 gap-8 pb-12 animate-fade-in">
      
      {/* --- DETALHES DO DIAGNÓSTICO (Screenshot 4) --- */}
      <div className="flex flex-col gap-6">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-primary">Início</span>
            <span className="text-text-muted">/</span>
            <span className="font-medium text-primary">Meus Diagnósticos</span>
            <span className="text-text-muted">/</span>
            <span className="font-medium text-text-main">Diagnóstico #1234</span>
          </div>

          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h1 className="text-text-main text-4xl font-black tracking-tight">Detalhes do Diagnóstico</h1>
            <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary/10 text-primary text-sm font-bold gap-2 hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-base">print</span>
                <span>Exportar para PDF</span>
            </button>
          </div>

          {/* Primary Diagnosis Card */}
          <div className="flex flex-col gap-6 p-6 bg-surface-light rounded-xl border border-border-light shadow-sm">
            <div className="flex flex-col gap-3">
                <p className="text-text-main text-2xl font-bold tracking-tight">Diagnóstico Principal: {mainDiagnosis.name}</p>
                <div className="flex flex-wrap items-center gap-4">
                    {mainDiagnosis.scientificName && (
                        <p className="text-secondary text-base font-normal italic">{mainDiagnosis.scientificName}</p>
                    )}
                    <div className="flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/20 px-3">
                        <p className="text-primary text-xs font-medium">{mainDiagnosis.type}</p>
                    </div>
                </div>
            </div>

            {/* Details Sections */}
            <div className="flex flex-col gap-4">
                {/* Sintomas */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl text-primary">local_florist</span>
                        <h3 className="text-text-main text-lg font-bold">Sintomas Principais</h3>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-text-muted pl-2">
                        {mainDiagnosis.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
                
                {/* Causas */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl text-primary">help_outline</span>
                        <h3 className="text-text-main text-lg font-bold">Causas Prováveis</h3>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-text-muted pl-2">
                        {mainDiagnosis.causes.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>

                {/* Condições */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl text-primary">thermostat</span>
                        <h3 className="text-text-main text-lg font-bold">Condições que Favorecem</h3>
                    </div>
                     <ul className="list-disc list-inside space-y-1 text-text-muted pl-2">
                        {mainDiagnosis.conditions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>

                {/* Riscos */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-accent">
                        <span className="material-symbols-outlined text-xl">warning</span>
                        <h3 className="text-accent text-lg font-bold">Riscos Potenciais</h3>
                    </div>
                    <p className="text-text-muted pl-2">{mainDiagnosis.risks}</p>
                </div>
            </div>
          </div>

          {/* Secondary Diagnosis */}
          {secondaryDiagnosis && (
              <div className="flex flex-col gap-4">
                <h2 className="text-text-main text-2xl font-bold tracking-tight">Diagnóstico Secundário</h2>
                <div className="flex flex-col gap-6 p-6 bg-surface-light/50 rounded-xl border border-dashed border-border-light">
                    <div className="flex flex-col gap-3">
                        <p className="text-text-main text-xl font-bold tracking-tight">{secondaryDiagnosis.name}</p>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-full bg-accent/20 px-3">
                                <p className="text-accent text-xs font-medium">{secondaryDiagnosis.type}</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-text-muted">{secondaryDiagnosis.description}</p>
                </div>
              </div>
          )}
          
          <div className="flex justify-start pt-4 pb-8 border-b border-border-light">
              <a href="#plano-acao" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold gap-2 hover:opacity-90 transition-opacity">
                  <span>Ver Soluções Recomendadas</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
              </a>
          </div>
      </div>


      {/* --- PLANO DE AÇÃO (Screenshot 5) --- */}
      <div id="plano-acao" className="flex flex-col gap-8 pt-4">
          <div className="mb-2">
            <p className="text-primary text-4xl font-black leading-tight tracking-tight">{mainDiagnosis.name}: Plano de Ação e Prevenção</p>
            <p className="text-text-muted mt-2 text-lg font-normal leading-normal">Siga estas orientações para tratar o problema da sua planta e evitar que ele retorne.</p>
          </div>

          {/* Summary Card */}
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 rounded-xl bg-surface-light p-6 shadow-md">
              <div className="flex flex-col gap-2 flex-[2_2_0px]">
                  <p className="text-primary text-xl font-bold leading-tight">Problema Diagnosticado: {mainDiagnosis.name}</p>
                  <p className="text-text-muted text-base font-normal leading-relaxed">
                      {mainDiagnosis.name} é classificado como {mainDiagnosis.type}. {mainDiagnosis.risks}
                  </p>
              </div>
               {/* Placeholder image if no image provided or specific image for disease */}
              <div className="w-full bg-center bg-no-repeat aspect-video md:aspect-auto bg-cover rounded-lg flex-1 min-h-[150px] bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-6xl">image</span>
              </div>
          </div>

          {/* Accordions */}
          <div className="flex flex-col gap-3">
              {/* Medidas Mecânicas */}
              <details className="flex flex-col rounded-xl border border-secondary/50 bg-surface-light shadow-sm group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
                      <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary text-2xl">content_cut</span>
                          <p className="text-text-main text-lg font-medium">Medidas Mecânicas Imediatas</p>
                      </div>
                      <span className="material-symbols-outlined text-primary transition-transform duration-300 group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="text-text-muted text-base font-normal leading-relaxed px-4 pb-4">
                      <ul className="list-disc pl-5 space-y-2">
                          {immediateActions.map((action, i) => <li key={i}>{action}</li>)}
                      </ul>
                  </div>
              </details>

              {/* Medidas Culturais */}
              <details className="flex flex-col rounded-xl border border-secondary/50 bg-surface-light shadow-sm group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
                      <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary text-2xl">water_drop</span>
                          <p className="text-text-main text-lg font-medium">Medidas Culturais / Manejo</p>
                      </div>
                      <span className="material-symbols-outlined text-primary transition-transform duration-300 group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="text-text-muted text-base font-normal leading-relaxed px-4 pb-4">
                      <ul className="list-disc pl-5 space-y-2">
                          {culturalActions.map((action, i) => <li key={i}>{action}</li>)}
                      </ul>
                  </div>
              </details>

              {/* Soluções Caseiras */}
              <details className="flex flex-col rounded-xl border border-secondary/50 bg-surface-light shadow-sm group" open>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
                      <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary text-2xl">science</span>
                          <p className="text-text-main text-lg font-medium">Soluções Caseiras</p>
                      </div>
                      <span className="material-symbols-outlined text-primary transition-transform duration-300 group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="text-text-muted text-base font-normal leading-relaxed px-4 pb-4">
                      <p className="mb-4">Receitas simples e eficazes que você pode preparar em casa.</p>
                      
                      {homeRecipes.map((recipe, i) => (
                          <div key={i} className="p-4 mb-4 border border-secondary/30 rounded-lg bg-background-light">
                              <div className="flex flex-col gap-4">
                                  <div>
                                      <p className="text-primary text-sm font-bold uppercase tracking-wide">RECEITA {i+1}</p>
                                      <p className="text-text-main text-2xl font-bold leading-tight">{recipe.title}</p>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                      <div>
                                          <h3 className="font-bold text-text-main mb-1">Ingredientes:</h3>
                                          <ul className="list-disc list-inside text-text-muted">
                                              {recipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
                                          </ul>
                                      </div>
                                      <div className="mt-2">
                                          <h3 className="font-bold text-text-main mb-1">Preparo:</h3>
                                          <p>{recipe.preparation}</p>
                                      </div>
                                      <div className="mt-2">
                                          <h3 className="font-bold text-text-main mb-1">Aplicação e Frequência:</h3>
                                          <p>{recipe.application}. {recipe.frequency}.</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </details>

              {/* Prevenção */}
              <details className="flex flex-col rounded-xl border border-secondary/50 bg-surface-light shadow-sm group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
                      <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary text-2xl">health_and_safety</span>
                          <p className="text-text-main text-lg font-medium">Prevenção</p>
                      </div>
                      <span className="material-symbols-outlined text-primary transition-transform duration-300 group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="text-text-muted text-base font-normal leading-relaxed px-4 pb-4">
                      <ul className="list-disc pl-5 space-y-2">
                          {prevention.map((action, i) => <li key={i}>{action}</li>)}
                      </ul>
                  </div>
              </details>
          </div>

          {/* Technical Help */}
          {technicalHelpTrigger && (
            <div className="mt-6">
                <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight px-4 pb-3 pt-5 border-b border-primary/20">Quando Buscar Ajuda Técnica</h2>
                <div className="bg-surface-light p-6 rounded-b-xl flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                        <p className="text-text-muted mb-4">{technicalHelpTrigger}</p>
                    </div>
                    <button className="w-full md:w-auto flex-shrink-0 bg-accent hover:bg-accent/90 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">support_agent</span>
                        Buscar Ajuda Técnica
                    </button>
                </div>
            </div>
          )}

          {/* Feedback / Reset */}
          <div className="mt-12 text-center pb-10">
              <div className="bg-surface-light p-6 rounded-xl shadow-sm mb-8">
                  <p className="text-text-main font-medium mb-3">Esta solução foi útil?</p>
                  <div className="flex justify-center gap-4">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/50 text-primary hover:bg-primary/10 transition-colors">
                          <span className="material-symbols-outlined">thumb_up</span>
                          Sim
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-text-muted/50 text-text-muted hover:bg-gray-200 transition-colors">
                          <span className="material-symbols-outlined">thumb_down</span>
                          Não
                      </button>
                  </div>
              </div>
              
              <button 
                onClick={onReset}
                className="text-text-muted underline hover:text-primary"
              >
                Iniciar Novo Diagnóstico
              </button>
          </div>
      </div>
    </div>
  );
};

export default DiagnosisView;