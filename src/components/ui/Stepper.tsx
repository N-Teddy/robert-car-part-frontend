// src/components/ui/Stepper.tsx
import React from 'react';
import { Check } from 'lucide-react';

interface Step {
    id: number;
    label: string;
    icon?: React.ElementType;
}

interface StepperProps {
    steps: Step[];
    currentStep: number;
    onStepClick?: (step: number) => void;
    allowNavigation?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({
    steps,
    currentStep,
    onStepClick,
    allowNavigation = true,
}) => {
    const handleStepClick = (stepId: number) => {
        if (allowNavigation && onStepClick && stepId < currentStep) {
            onStepClick(stepId);
        }
    };

    return (
        <div className="w-full">
            <div className="relative flex items-center justify-between">
                {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    const isClickable = allowNavigation && step.id < currentStep;
                    const Icon = step.icon;

                    return (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="relative flex flex-col items-center flex-1">
                                {/* Line connector */}
                                {index !== steps.length - 1 && (
                                    <div
                                        className={`absolute top-5 left-1/2 w-full h-0.5 transition-all duration-300 ${isCompleted ? 'bg-purple-600' : 'bg-gray-300'
                                            }`}
                                        style={{
                                            left: '50%',
                                            right: '-50%',
                                            width: 'calc(100% - 2.5rem)'
                                        }}
                                    />
                                )}

                                {/* Step circle */}
                                <button
                                    onClick={() => handleStepClick(step.id)}
                                    disabled={!isClickable}
                                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                                            ? 'bg-purple-600 text-white ring-4 ring-purple-100'
                                            : isCompleted
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-300 text-gray-600'
                                        } ${isClickable
                                            ? 'cursor-pointer hover:ring-4 hover:ring-purple-100'
                                            : 'cursor-default'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <Check size={20} className="text-white" />
                                    ) : Icon ? (
                                        <Icon size={20} />
                                    ) : (
                                        <span className="text-sm font-semibold">{step.id}</span>
                                    )}
                                </button>

                                {/* Step label */}
                                <div className="mt-2 text-center">
                                    <p className={`text-xs font-medium transition-colors ${isActive || isCompleted
                                            ? 'text-purple-600'
                                            : 'text-gray-500'
                                        }`}>
                                        {step.label}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};