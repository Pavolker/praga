import { GoogleGenAI, Type } from "@google/genai";
import { FormData, InitialAnalysisResult, FinalDiagnosis, Question } from "../types";

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'placeholder-key') {
    throw new Error("⚠️ Chave da API Gemini não configurada. No Netlify, configure a variável VITE_GEMINI_API_KEY nas configurações do site (Site configuration → Environment variables). Obtenha sua chave em: https://aistudio.google.com/app/apikey");
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION = `
Você é o Agente **Inteligência das Plantas : Diagnóstico**, um sistema especializado em:
* interpretação de sintomas relatados pelo usuário;
* identificação probabilística de pragas, doenças, deficiências nutricionais e problemas fisiológicos;
* formulação de perguntas discriminantes para refinamento diagnóstico;
* apresentação das causas prováveis;
* indicação de soluções caseiras, seguras e práticas;
* prevenção e manejo adequado.

Você deve operar sempre com objetividade, neutralidade e precisão técnica.
Não usar adjetivos valorativos, alarmismo, julgamentos, ou afirmações conclusivas como certeza absoluta.
Não prescrever produtos químicos controlados.
Priorizar medidas mecânicas, culturais e receitas caseiras seguras.

REGRAS OBRIGATÓRIAS:
1. Priorizar medidas mecânicas e caseiras.
2. Não recomendar produtos proibidos, tóxicos ou de uso restrito.
3. Não usar linguagem alarmista.
4. Não apresentar conclusões absolutas; sempre falar em probabilidade.
5. Não fazer juízo de valor.
6. Ser sintético, direto e tecnicamente neutro.
7. Não usar adjetivos qualificativos.
8. Não recomendar tratamentos perigosos (água sanitária pura, álcool direto, pesticidas fortes).
9. Evitar prescrever produtos comerciais sem contexto regulatório.
10. Não ultrapassar o domínio de cuidados domésticos.
`;

/**
 * Step 1: Analyze initial data and generate hypotheses + questions
 */
export const analyzeInitialSymptoms = async (data: FormData): Promise<InitialAnalysisResult> => {
  const model = "gemini-2.5-flash";

  const promptText = `
    Etapa 2 — Pré-diagnóstico
    Analise os seguintes dados de uma planta doente:
    Planta: ${data.plantType}
    Ambiente: ${data.environment}
    Sintomas (descrição): ${data.symptoms}
    Sintomas (selecionados): ${data.selectedSymptoms.join(', ')}
    Tempo de evolução: ${data.evolutionTime}
    Condições recentes: ${data.recentConditions.join(', ')}
    
    Gere até 3 hipóteses prováveis (classificadas como Alta, Média ou Baixa probabilidade).
    Para cada hipótese, gere perguntas objetivas, fechadas e discriminantes (Sim/Não) para refinar o diagnóstico.
    As perguntas devem ser específicas e úteis para diferenciar as hipóteses.
  `;

  const parts: any[] = [{ text: promptText }];



  const schema = {
    type: Type.OBJECT,
    properties: {
      hypotheses: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            probability: { type: Type.STRING, enum: ["Alta", "Média", "Baixa"] },
            description: { type: Type.STRING },
            scientificName: { type: Type.STRING }
          },
          required: ["name", "probability", "description"]
        }
      },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            text: { type: Type.STRING }
          },
          required: ["id", "text"]
        }
      }
    },
    required: ["hypotheses", "questions"]
  };

  try {
    const result = await getClient().models.generateContent({
      model: model,
      contents: { role: 'user', parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = result.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as InitialAnalysisResult;
  } catch (error) {
    console.error("Error in analyzeInitialSymptoms:", error);
    throw error;
  }
};

/**
 * Step 2: Finalize diagnosis based on answers
 */
export const finalizeDiagnosis = async (
  originalData: FormData,
  initialResult: InitialAnalysisResult,
  answeredQuestions: Question[]
): Promise<FinalDiagnosis> => {
  const model = "gemini-2.5-flash";

  const answersText = answeredQuestions.map(q => `P: ${q.text} R: ${q.answer}`).join('\n');
  const hypothesesText = initialResult.hypotheses.map(h => `${h.name} (${h.probability})`).join(', ');

  const promptText = `
    Etapa 4 — Diagnóstico final
    Com base na análise anterior (Hipóteses: ${hypothesesText}) e nas respostas do usuário:
    ${answersText}
    
    Dados originais:
    Planta: ${originalData.plantType}
    Sintomas (descrição): ${originalData.symptoms}
    Sintomas (selecionados): ${originalData.selectedSymptoms.join(', ')}
    
    Selecione 1 hipótese principal e, se necessário, 1 hipótese secundária.
    
    Etapa 5 — Orientações de solução (prioridade obrigatória)
    Forneça medidas mecânicas imediatas, medidas culturais/manejo, e soluções caseiras seguras (com ingredientes, preparo, aplicação e frequência).
    
    Etapa 6 — Prevenção
    Forneça medidas preventivas.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      mainDiagnosis: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Nome comum do problema" },
          scientificName: { type: Type.STRING, description: "Nome científico" },
          type: { type: Type.STRING, enum: ["Praga", "Doença", "Deficiência", "Fisiológico"] },
          symptoms: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Sintomas principais (objetivos)" },
          causes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Causas prováveis" },
          conditions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Condições que favorecem" },
          risks: { type: Type.STRING, description: "Riscos potenciais (sem alarmismo)" }
        },
        required: ["name", "type", "symptoms", "causes", "risks"]
      },
      secondaryDiagnosis: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      },
      immediateActions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Medidas mecânicas imediatas" },
      culturalActions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Medidas culturais / manejo" },
      homeRecipes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            preparation: { type: Type.STRING },
            application: { type: Type.STRING },
            frequency: { type: Type.STRING }
          },
          required: ["title", "ingredients", "preparation", "application", "frequency"]
        }
      },
      prevention: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Medidas preventivas" },
      technicalHelpTrigger: { type: Type.STRING, description: "Situações para buscar ajuda técnica (opcional)" }
    },
    required: ["mainDiagnosis", "immediateActions", "culturalActions", "homeRecipes", "prevention"]
  };

  try {
    const result = await getClient().models.generateContent({
      model: model,
      contents: { role: 'user', parts: [{ text: promptText }] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = result.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as FinalDiagnosis;
  } catch (error) {
    console.error("Error in finalizeDiagnosis:", error);
    throw error;
  }
};
