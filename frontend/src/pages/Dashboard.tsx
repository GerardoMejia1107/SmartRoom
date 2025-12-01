// Dashboard.tsx - OPTIMIZADO
import {ActivityIcon, AlarmCheckIcon, LucideDroplets, Sun, Thermometer} from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";
import ControlPanel from "../components/ControlPanel";
import {useGetSensors} from "../api/sensorsApi";
import {useEffect, useState, useMemo, useCallback} from "react";
import {
    useGetControls,
    useUpdateDoor,
    useUpdateLights,
    useUpdateManualControl,
    useUpdateWindow
} from "../api/controlsApi";


function Dashboard() {

    const {commonFetch: getStoredSensorsData, data: sensorsData} = useGetSensors()
    const {commonFetch: getStoredDevicesData, data: controlsData} = useGetControls()

    const {commonFetch: updateDoor} = useUpdateDoor()
    const {commonFetch: updateWindow} = useUpdateWindow()
    const {commonFetch: updateLights} = useUpdateLights()
    const {commonFetch: updateManualControl} = useUpdateManualControl()

    const [doorOpen, setDoorOpen] = useState(false);
    const [windowOpen, setWindowOpen] = useState(false);
    const [lightOn, setLightOn] = useState(false);
    const [manualControlOn, setManualControlOn] = useState(false);

    // Memoizar el último row para evitar recalculaciones
    const lastRow = useMemo(() =>
            sensorsData?.[sensorsData.length - 1],
        [sensorsData]
    );

    // Load initial
    useEffect(() => {
        getStoredDevicesData({});
        getStoredSensorsData({});
    }, []);

    // Sync with DB
    useEffect(() => {
        if (!controlsData) return;

        setDoorOpen(controlsData.door?.state === "open");
        setWindowOpen(controlsData.window?.state === "open");
        setLightOn(controlsData.lights?.on);
        setManualControlOn(controlsData.available);

    }, [controlsData]);

    // Refresh sensors every 5s - OPTIMIZADO
    useEffect(() => {
        const interval = setInterval(() => {
            getStoredSensorsData({});
        }, 5000);

        return () => clearInterval(interval);
    }, [getStoredSensorsData]); // Dependencia explícita

    // HANDLERS MEMOIZADOS - Esto previene re-renderizados innecesarios
    const handleDoorChange = useCallback(async (v: boolean) => {
        setDoorOpen(v);
        await updateDoor({input: {state: v ? "open" : "closed"}});
        await getStoredDevicesData({}); // Refrescar después de actualizar
    }, [updateDoor, getStoredDevicesData]);

    const handleWindowChange = useCallback(async (v: boolean) => {
        setWindowOpen(v);
        await updateWindow({input: {state: v ? "open" : "closed"}});
        await getStoredDevicesData({}); // Refrescar después de actualizar
    }, [updateWindow, getStoredDevicesData]);

    const handleLightChange = useCallback(async (v: boolean) => {
        setLightOn(v);
        await updateLights({input: {on: v}});
        await getStoredDevicesData({}); // Refrescar después de actualizar
    }, [updateLights, getStoredDevicesData]);

    const handleManualControlChange = useCallback(async (v: boolean) => {
        setManualControlOn(v);
        await updateManualControl({input: {available: v}});
        await getStoredDevicesData({}); // Refrescar después de actualizar
    }, [updateManualControl, getStoredDevicesData]);

    // SENSOR BOXES VISUAL - Memoizado
    const sensors = useMemo(() => [
        {icon: <Thermometer size={36}/>, label: "Temperature", value: lastRow?.temperature_c, unit: "°C"},
        {icon: <LucideDroplets size={36}/>, label: "Humidity", value: lastRow?.humidity_pct, unit: "%"},
        {icon: <Sun size={36}/>, label: "Light", value: lastRow?.light_pct, unit: "%"},
        {
            icon: <ActivityIcon size={36}/>,
            label: "Movement",
            value: lastRow?.motion ? "Motion detected" : "No motion",
            unit: ""
        }
    ], [lastRow]);

    // CHART DATA - Memoizado para evitar recalcular en cada render
    const formattedChartData = useMemo(() =>
            sensorsData?.map(item => {
                const time = new Date(item.timestamp).toLocaleTimeString("es-SV", {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric"
                });

                return {
                    time,
                    temp: Number(item.temperature_c),
                    humidity: Number(item.humidity_pct),
                    light: Number(item.light_pct)
                };
            }) ?? []
        , [sensorsData]);

    return (
        <div className="w-full px-4 py-3 flex flex-col gap-3">

            {/* CONTROLS PANEL */}
            <div className="mb-2">
                <ControlPanel
                    doorOpen={doorOpen}
                    windowOpen={windowOpen}
                    lightOn={lightOn}
                    manualControlOn={manualControlOn}
                    onDoorChange={handleDoorChange}
                    onWindowChange={handleWindowChange}
                    onLightChange={handleLightChange}
                    onManualControlChange={handleManualControlChange}
                />
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

                {/* LEFT COLUMN – SENSOR BOXES */}
                <div className="flex flex-col gap-3">
                    {sensors.map((sensor, i) => (
                        <div
                            key={sensor.label} // Key estable en lugar de índice
                            className="bg-[#1f2530] p-4 rounded-xl shadow border border-[#2a323e] flex flex-col"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-[#2a323e] rounded-xl">
                                    {sensor.icon}
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400">Sensor</span>
                                    <h3 className="text-lg font-semibold">{sensor.label}</h3>
                                </div>
                            </div>

                            <div className="flex items-baseline">
                                <span className="text-4xl font-bold">{sensor.value}</span>
                                <span className="text-gray-400 ml-2 text-sm">{sensor.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT COLUMN – CHART */}
                <div className="xl:col-span-2 bg-[#1f2530] p-5 rounded-xl shadow border border-[#2a323e]">
                    <h2 className="text-xl font-semibold mb-4">Sensor Monitoring</h2>

                    <LineChart width={900} height={460} data={formattedChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a323e"/>
                        <XAxis dataKey="time" stroke="#ccc"/>
                        <YAxis stroke="#ccc"/>
                        <Tooltip/>
                        <Legend/>
                        <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2}/>
                        <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2}/>
                        <Line type="monotone" dataKey="light" stroke="#eab308" strokeWidth={2}/>
                    </LineChart>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;