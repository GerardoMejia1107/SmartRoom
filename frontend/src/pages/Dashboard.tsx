import {LucideDroplets, Sun, Thermometer} from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";
import ControlPanel from "../components/ControlPanel.tsx";
import {useGetSensors} from "../api/sensorsApi.ts";
import {useEffect} from "react";

function Dashboard() {
    const {commonFetch: getStoredSensorsData, data: sensorsData} = useGetSensors()

    // @ts-ignore
    const lastRow = sensorsData?.[sensorsData.length - 1];

    useEffect(() => {
        getStoredSensorsData({}).then(response => {
            console.log("Stored sensors data:", response);
        });

        let interval = setInterval(() => {
            getStoredSensorsData({}).then(response => {
                console.log("Stored sensors data:", response);
            })
        }, 5000)

        return () => clearInterval(interval);

    }, []);

    const sensors = [
        {icon: <Thermometer size={36}/>, label: "Temperature", value: lastRow?.temperature_c, unit: "°C"},
        {icon: <LucideDroplets size={36}/>, label: "Humidity", value: lastRow?.humidity_pct, unit: "%"},
        {icon: <Sun size={36}/>, label: "Light", value: lastRow?.light_pct, unit: "%"}
    ];

    // @ts-ignore
    const formattedChartData = sensorsData?.map(item => {
        const date = new Date(item.timestamp)
        const time = date.toLocaleTimeString("es-SV", {
            hour: "numeric", minute: "numeric", second: "numeric"
        });

        return {
            time: time,
            temp: String(item.temperature_c),
            humidity: String(item.humidity_pct),
            light: String(item.light_pct)
        }
    }) ?? [];

    return (
        <div className="w-full px-4 py-3 flex flex-col gap-1">

            {/* CONTROLS */}
            <div className="mb-1">
                <ControlPanel/>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

                {/* LEFT COLUMN - SENSORS */}
                <div className="flex flex-col gap-3">
                    {sensors.map((sensor, index) => (
                        <div key={index}
                             className="bg-[#1f2530] p-3 rounded-lg shadow border border-[#2a323e] flex flex-col">

                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-[#2a323e] rounded-md">
                                    {sensor.icon}
                                </div>

                                <div className="flex flex-col leading-none">
                                    <span className="text-xs text-gray-400">Sensor</span>
                                    <h3 className="text-md font-semibold leading-tight">{sensor.label}</h3>
                                </div>
                            </div>

                            <div>
                                <span className="text-3xl font-bold">{sensor.value}</span>
                                <span className="text-gray-400 ml-1 text-xs">{sensor.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT COLUMN - CHART */}
                <div className="xl:col-span-2 bg-[#1f2530] p-4 rounded-lg shadow border border-[#2a323e]">

                    <h2 className="text-lg font-semibold mb-2">Sensor Monitoring</h2>

                    <LineChart width={900} height={350} data={formattedChartData}>
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
