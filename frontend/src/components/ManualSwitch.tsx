import React from "react";
import { Wrench } from "lucide-react";

function ManualSwitch({ state, onChange }: { state: boolean; onChange: (v: boolean) => void }) {
    return (
        <div className="p-4 flex items-center justify-between hover:bg-[#252d3a]/40 transition-colors">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#2a3240] rounded-lg">
                    <Wrench size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Control</span>
                    <span className="font-semibold">Manual</span>
                </div>
            </div>

            <button
                onClick={() => onChange(!state)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                    state ? "bg-blue-600" : "bg-gray-600"
                }`}
            >
                <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        state ? "translate-x-7" : "translate-x-1"
                    }`}
                />
            </button>
        </div>
    );
}

export default React.memo(ManualSwitch);
