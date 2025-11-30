import React, { memo } from 'react';
import { Lock, Wind, Sun, Wrench } from 'lucide-react';

interface ControlPanelProps {
    doorOpen: boolean;
    windowOpen: boolean;
    lightOn: boolean;
    manualControlOn: boolean;
    onDoorChange: (value: boolean) => void;
    onWindowChange: (value: boolean) => void;
    onLightChange: (value: boolean) => void;
    onManualControlChange: (value: boolean) => void;
}

const ControlPanel = memo(({
    doorOpen,
    windowOpen,
    lightOn,
    manualControlOn,
    onDoorChange,
    onWindowChange,
    onLightChange,
    onManualControlChange
}: ControlPanelProps) => {
    return (
        <div className="bg-[#1e2532] rounded-xl border border-[#2a3240] overflow-hidden">
            <div className="grid grid-cols-4 divide-x divide-[#2a3240]">
                
                {/* DOOR */}
                <div className="p-4 flex items-center justify-between hover:bg-[#252d3a]/40 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#2a3240] rounded-lg">
                            <Lock size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400">Control</span>
                            <span className="font-semibold">Door</span>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => onDoorChange(!doorOpen)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                            doorOpen ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                    >
                        <div
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                doorOpen ? 'translate-x-7' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                {/* WINDOW */}
                <div className="p-4 flex items-center justify-between hover:bg-[#252d3a]/40 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#2a3240] rounded-lg">
                            <Wind size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400">Control</span>
                            <span className="font-semibold">Window</span>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => onWindowChange(!windowOpen)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                            windowOpen ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                    >
                        <div
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                windowOpen ? 'translate-x-7' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                {/* LIGHT */}
                <div className="p-4 flex items-center justify-between hover:bg-[#252d3a]/40 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#2a3240] rounded-lg">
                            <Sun size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400">Control</span>
                            <span className="font-semibold">Light</span>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => onLightChange(!lightOn)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                            lightOn ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                    >
                        <div
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                lightOn ? 'translate-x-7' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                {/* MANUAL CONTROL */}
                <div className="p-4 flex items-center justify-between hover:bg-[#252d3a]/40 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#2a3240] rounded-lg">
                            <Wrench size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400">Control</span>
                            <span className="font-semibold">Manual Control</span>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => onManualControlChange(!manualControlOn)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                            manualControlOn ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                    >
                        <div
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                manualControlOn ? 'translate-x-7' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

            </div>
        </div>
    );
});

ControlPanel.displayName = 'ControlPanel';

export default ControlPanel;