import { ShoppingCart, Home, CreditCard, CheckSquare, CheckCircle } from "lucide-react";

const steps = [
    { id: 1, label: "Order", icon: ShoppingCart },
    { id: 2, label: "Address", icon: Home },
    { id: 3, label: "Payment", icon: CreditCard },
    { id: 4, label: "Confirm", icon: CheckSquare },
];

export default function ProgressSteps({ currentStep }) {
    return (
        <div className="flex justify-between items-center w-full max-w-3xl mx-auto mb-8 relative">
            {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                    <div key={step.id} className="flex flex-col items-center flex-1 relative">
                        <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition
                                ${
                                    isCompleted
                                        ? "bg-green-500 text-white border-green-500"
                                        : isActive
                                        ? "border-red-500 text-red-500"
                                        : "border-gray-400 text-gray-400"
                                }`}
                        >
                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </div>
                        <p className="text-xs mt-2 text-center">{step.label}</p>
                        {idx < steps.length - 1 && (
                            <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-400 -z-10 hidden sm:block"></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
