import React, { memo } from "react";
import DoorSwitch from "./DoorSwitch";
import WindowSwitch from "./WindowSwitch";
import LightSwitch from "./LightSwitch";
import ManualSwitch from "./ManualSwitch";

interface Props {
    doorOpen: boolean;
    windowOpen: boolean;
    lightOn: boolean;
    manualControlOn: boolean;
    onDoorChange: (v: boolean) => void;
    onWindowChange: (v: boolean) => void;
    onLightChange: (v: boolean) => void;
    onManualControlChange: (v: boolean) => void;
}

function ControlPanel({
                          doorOpen,
                          windowOpen,
                          lightOn,
                          manualControlOn,
                          onDoorChange,
                          onWindowChange,
                          onLightChange,
                          onManualControlChange,
                      }: Props) {
    return (
        <div className="bg-[#1e2532] rounded-xl border border-[#2a3240] overflow-hidden">
            <div className="grid grid-cols-4 divide-x divide-[#2a3240]">

                <DoorSwitch state={doorOpen} onChange={onDoorChange} />
                <WindowSwitch state={windowOpen} onChange={onWindowChange} />
                <LightSwitch state={lightOn} onChange={onLightChange} />
                <ManualSwitch state={manualControlOn} onChange={onManualControlChange} />

            </div>
        </div>
    );
}

export default memo(ControlPanel);
