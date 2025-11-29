import { useState } from "react";
import { Lock, Unlock, Sun, Wind } from "lucide-react";
import ControlSwitch from "./ControlSwitch.tsx";

export function ControlPanel() {
    const [doorOpen, setDoorOpen] = useState(false);
    const [windowOpen, setWindowOpen] = useState(false);
    const [lightOn, setLightOn] = useState(false);

    return (
        <div className="w-full bg-[#1f2530] p-4 rounded-xl shadow-md border border-[#2a323e] mb-6">
            <h2 className="text-xl font-semibold mb-4">Controls</h2>

            <div className="flex gap-10">

                {/* DOOR */}
                <ControlSwitch
                    label="Door"
                    state={doorOpen}
                    setState={setDoorOpen}
                    iconOn={<Unlock className="text-green-400" />}
                    iconOff={<Lock className="text-red-400" />}
                />

                {/* WINDOW */}
                <ControlSwitch
                    label="Window"
                    state={windowOpen}
                    setState={setWindowOpen}
                    iconOn={<Wind className="text-green-400" />}
                    iconOff={<Wind className="text-gray-500" />}
                />

                {/* LIGHT */}
                <ControlSwitch
                    label="Light"
                    state={lightOn}
                    setState={setLightOn}
                    iconOn={<Sun className="text-yellow-400" />}
                    iconOff={<Sun className="text-gray-500" />}
                />

            </div>
        </div>
    );
}

export default ControlPanel;
