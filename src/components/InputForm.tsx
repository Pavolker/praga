import React, { ChangeEvent } from 'react';
import { FormData } from '../types';

interface InputFormProps {
    data: FormData;
    onChange: (data: FormData) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ data, onChange, onSubmit, isSubmitting }) => {


    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: value });
    };

    const handleConditionChange = (condition: string) => {
        const current = data.recentConditions;
        const updated = current.includes(condition)
            ? current.filter(c => c !== condition)
            : [...current, condition];
        onChange({ ...data, recentConditions: updated });
    };



    const SYMPTOM_CATEGORIES = {
        'Folhas': ['Amarelamento', 'Manchas marrons', 'Manchas brancas', 'Buracos', 'Enrolamento', 'Murcha', 'Queda prematura', 'Bordas queimadas'],
        'Caule e Raiz': ['Apodrecimento', 'Manchas escuras', 'Insetos visíveis', 'Teias'],
        'Flores e Frutos': ['Queda de botões', 'Frutos deformados', 'Manchas nos frutos', 'Ausência de floração'],
        'Geral': ['Crescimento lento', 'Planta inteira seca', 'Pragas visíveis']
    };

    const handleSymptomToggle = (symptom: string) => {
        const current = data.selectedSymptoms || [];
        const updated = current.includes(symptom)
            ? current.filter(s => s !== symptom)
            : [...current, symptom];
        onChange({ ...data, selectedSymptoms: updated });
    };

    return (
        <div className="mx-auto w-full max-w-5xl rounded-xl bg-surface-light p-6 shadow-lg sm:p-8 md:p-10 animate-fade-in">
            <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>

                {/* Section 1: Identificação */}
                <div className="space-y-6">
                    <div className="border-b border-border-light pb-2">
                        <h3 className="text-xl font-bold text-text-main">1. Identificação da Planta</h3>
                        <p className="text-sm text-text-muted">Conte-nos um pouco sobre sua planta e onde ela vive.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Tipo de planta */}
                        <label className="flex flex-col">
                            <p className="pb-2 text-base font-medium">Tipo de planta</p>
                            <input
                                className="form-input h-12 w-full rounded-lg border-border-light bg-background-light p-3 text-base text-text-main placeholder:text-text-muted focus:border-primary focus:ring-primary"
                                placeholder="Ex: Samambaia, Roseira, etc."
                                type="text"
                                name="plantType"
                                value={data.plantType}
                                onChange={handleInputChange}
                                required
                            />
                        </label>

                        {/* Ambiente */}
                        <label className="flex flex-col">
                            <p className="pb-2 text-base font-medium">Ambiente</p>
                            <select
                                className="form-select h-12 w-full rounded-lg border-border-light bg-background-light p-3 text-base text-text-main focus:border-primary focus:ring-primary"
                                name="environment"
                                value={data.environment}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione o ambiente</option>
                                <option value="Interno">Interno</option>
                                <option value="Externo - Sol Pleno">Externo - Sol Pleno</option>
                                <option value="Externo - Sombra Parcial">Externo - Sombra Parcial</option>
                            </select>
                        </label>
                    </div>
                </div>

                {/* Section 2: Sintomas */}
                <div className="space-y-6">
                    <div className="border-b border-border-light pb-2">
                        <h3 className="text-xl font-bold text-text-main">2. Sintomas Observados</h3>
                        <p className="text-sm text-text-muted">Selecione tudo o que se aplica ao problema.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
                        {Object.entries(SYMPTOM_CATEGORIES).map(([category, symptoms]) => (
                            <div key={category} className="bg-background-light/50 p-4 rounded-lg border border-border-light/50">
                                <p className="text-sm font-bold text-primary mb-3 uppercase tracking-wide">{category}</p>
                                <div className="flex flex-wrap gap-2">
                                    {symptoms.map(symptom => (
                                        <button
                                            key={symptom}
                                            type="button"
                                            onClick={() => handleSymptomToggle(symptom)}
                                            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${data.selectedSymptoms?.includes(symptom)
                                                ? 'bg-primary text-white shadow-md transform scale-105'
                                                : 'bg-white border border-border-light text-text-main hover:bg-gray-50 hover:border-primary/30'
                                                }`}
                                        >
                                            {symptom}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 3: Contexto */}
                <div className="space-y-6">
                    <div className="border-b border-border-light pb-2">
                        <h3 className="text-xl font-bold text-text-main">3. Detalhes e Contexto</h3>
                        <p className="text-sm text-text-muted">Informações adicionais ajudam no diagnóstico preciso.</p>
                    </div>

                    {/* Left: Textarea */}
                    <div className="border border-primary/30 rounded-lg p-4 bg-primary/5">
                        <label className="flex flex-col h-full">
                            <p className="pb-2 text-base font-medium">Outros detalhes (Opcional)</p>
                            <textarea
                                className="form-textarea w-full flex-1 rounded-lg border-border-light bg-background-light p-3 text-base text-text-main placeholder:text-text-muted focus:border-primary focus:ring-primary min-h-[120px]"
                                placeholder="Descreva outros detalhes que não encontrou acima..."
                                name="symptoms"
                                value={data.symptoms}
                                onChange={handleInputChange}
                            ></textarea>
                        </label>
                    </div>

                    {/* Right: Evolution & Conditions */}
                    <div className="space-y-6">
                        {/* Tempo de evolução */}
                        <div>
                            <p className="pb-2 text-base font-medium">Tempo de evolução</p>
                            <div className="flex flex-col gap-2">
                                {['Menos de 1 semana', '1-2 semanas', 'Mais de 1 mês'].map(time => (
                                    <label key={time} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${data.evolutionTime === time ? 'border-primary bg-primary/5' : 'border-border-light bg-background-light hover:bg-gray-50'}`}>
                                        <input
                                            className="form-radio h-4 w-4 border-border-light text-primary focus:ring-primary"
                                            name="evolution-time"
                                            type="radio"
                                            checked={data.evolutionTime === time}
                                            onChange={() => onChange({ ...data, evolutionTime: time })}
                                        />
                                        <span className="text-sm font-medium text-text-main">{time}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Condições recentes */}
                        <div>
                            <p className="pb-2 text-base font-medium">Condições recentes</p>
                            <div className="grid grid-cols-2 gap-2">
                                {['Muda de vaso', 'Adubação', 'Pragas visíveis', 'Mudança de local'].map(cond => (
                                    <label key={cond} className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2 transition-colors ${data.recentConditions.includes(cond) ? 'border-primary bg-primary/5' : 'border-border-light bg-background-light hover:bg-gray-50'}`}>
                                        <input
                                            className="form-checkbox h-4 w-4 rounded border-border-light text-primary focus:ring-primary"
                                            type="checkbox"
                                            checked={data.recentConditions.includes(cond)}
                                            onChange={() => handleConditionChange(cond)}
                                        />
                                        <span className="text-xs font-medium text-text-main">{cond}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse items-center justify-end gap-4 border-t border-border-light pt-8 sm:flex-row">
                    <button
                        className="h-12 w-full rounded-lg px-6 font-bold text-secondary transition-colors hover:bg-secondary/10 sm:w-auto"
                        type="button"
                        onClick={() => onChange({ ...data, plantType: '', environment: '', symptoms: '', selectedSymptoms: [], evolutionTime: '', recentConditions: [] })}
                    >
                        Limpar Campos
                    </button>
                    <button
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 font-bold text-white shadow-md transition-all hover:bg-primary/90 hover:shadow-lg sm:w-auto disabled:opacity-70 disabled:shadow-none"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span>Analisando...</span>
                        ) : (
                            <>
                                <span>Analisar Sintomas</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InputForm;