import React from 'react';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    labels: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, labels }) => {
    const progress = (currentStep === 1 ? 15 : (currentStep / totalSteps) * 100);

    return (
        <div className="w-full">
            <div className="mx-auto max-w-2xl">
                <div className="flex justify-between text-sm font-medium text-text-muted mb-2">
                    {labels.map((label, index) => (
                         <p key={index} className={`${index + 1 === currentStep ? 'text-primary font-bold' : ''}`}>
                            {index + 1}. {label}
                         </p>
                    ))}
                </div>
                <div className="h-2 w-full rounded-full bg-border-light">
                    <div 
                        className="h-2 rounded-full bg-primary transition-all duration-500 ease-out" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;