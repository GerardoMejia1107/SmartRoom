// ControlSwitch.tsx
import React from "react";

type Props = {
    label: string;
    state: boolean;
    onToggle: (newState: boolean) => void;
    iconOn: React.ReactNode;
    iconOff: React.ReactNode;
};

export default function ControlSwitch({ label, state, onToggle, iconOn, iconOff }: Props) {

    return (
        <div className="flex items-center gap-4 bg-[#2a323e] px-4 py-3 rounded-xl border border-[#3a4454] w-64">
            {/* ICON */}
            <div className="flex items-center justify-center bg-[#1f2530] p-2 rounded-lg">
                {state ? iconOn : iconOff}
            </div>

            {/* LABEL */}
            <div className="flex flex-col flex-grow">
                <span className="text-gray-400 text-sm">Control</span>
                <h3 className="text-lg font-semibold">{label}</h3>
            </div>

            {/* SWITCH BUTTON */}
            <button
                onClick={() => onToggle(!state)}
                className={`
                    w-12 h-6 rounded-full relative transition
                    ${state ? "bg-green-500" : "bg-gray-500"}
                `}
            >
                <span
                    className={`
                        absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition
                        ${state ? "translate-x-6" : "translate-x-0"}
                    `}
                />
            </button>
        </div>
    );
}
