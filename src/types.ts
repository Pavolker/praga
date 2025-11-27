export enum AppState {
  FORM = 'FORM',
  ANALYZING_INITIAL = 'ANALYZING_INITIAL',
  REFINEMENT = 'REFINEMENT',
  ANALYZING_FINAL = 'ANALYZING_FINAL',
  DETAIL_VIEW = 'DETAIL_VIEW'
}

export interface FormData {
  plantType: string;
  environment: string;
  symptoms: string;
  selectedSymptoms: string[];
  evolutionTime: string;
  recentConditions: string[];

}

export interface Question {
  id: string;
  text: string;
  answer?: 'yes' | 'no';
}

export interface Hypothesis {
  name: string;
  probability: 'Alta' | 'Média' | 'Baixa';
  description: string;
  scientificName?: string;
}

export interface InitialAnalysisResult {
  hypotheses: Hypothesis[];
  questions: Question[];
}

export interface Recipe {
  title: string;
  ingredients: string[];
  preparation: string;
  application: string;
  frequency: string;
}

export interface FinalDiagnosis {
  mainDiagnosis: {
    name: string;
    scientificName: string;
    type: 'Praga' | 'Doença' | 'Deficiência' | 'Fisiológico';
    symptoms: string[];
    causes: string[];
    conditions: string[];
    risks: string;
  };
  secondaryDiagnosis?: {
    name: string;
    type: string;
    description: string;
  };
  immediateActions: string[];
  culturalActions: string[];
  homeRecipes: Recipe[];
  prevention: string[];
  technicalHelpTrigger?: string;
}