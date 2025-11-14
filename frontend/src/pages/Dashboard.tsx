import {LucideDroplets, Sun, Thermometer} from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";

function Dashboard() {
    const sensors = [
        {icon: <Thermometer size={40}/>, label: "Temperature", levels: [], value: 15, unit: "°C"},
        {icon: <LucideDroplets size={40}/>, label: "Humidity", levels: [], value: 15, unit: "%"},
        {icon: <Sun size={40}/>, label: "Light", levels: [], value: 15, unit: "%"}
    ]

    const data = [
        {time: "10:00", temp: 24, humidity: 40, light: 60},
        {time: "10:01", temp: 25, humidity: 42, light: 65},
        {time: "10:00", temp: 24, humidity: 40, light: 60},
        {time: "10:01", temp: 25, humidity: 42, light: 65},
        {time: "10:00", temp: 24, humidity: 40, light: 60},
        {time: "10:01", temp: 25, humidity: 42, light: 65},
        {time: "10:00", temp: 24, humidity: 40, light: 60},
        {time: "10:01", temp: 25, humidity: 42, light: 65},
        {time: "10:00", temp: 24, humidity: 40, light: 60},
        {time: "10:01", temp: 25, humidity: 42, light: 65},
        {time: "10:00", temp: 24, humidity: 40, light: 60},
        {time: "10:01", temp: 25, humidity: 42, light: 65},
        {time: "10:00", temp: 24, humidity: 40, light: 60},
        {time: "10:01", temp: 25, humidity: 42, light: 65},
        {time: "10:00", temp: 24, humidity: 40, light: 60},
        {time: "10:01", temp: 25, humidity: 42, light: 65},
        {time: "10:00", temp: 24, humidity: 40, light: 60},
        {time: "10:01", temp: 25, humidity: 42, light: 65},
        {time: "10:00", temp: 24, humidity: 40, light: 60},
        {time: "10:01", temp: 25, humidity: 42, light: 65},
        {time: "10:00", temp: 24, humidity: 40, light: 60},
        {time: "10:01", temp: 25, humidity: 42, light: 65},
        {time: "10:01", temp: 25, humidity: 42, light: 90},
        {time: "10:01", temp: 25, humidity: 42, light: 10},
    ]

    return <div className={"flex gap-10"}>
        <div className="flex flex-col gap-10">
            {
                sensors.map(sensor => <li className={"list-none"}>
                    <div className="bg-[#1f2530] p-4 rounded-xl shadow-md border border-[#2a323e] w-full max-w-xs">

                        {/* ICON + LABEL */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-[#2a323e] rounded-lg">
                                {sensor.icon}
                            </div>

                            <div className="flex flex-col">
                                <span className="text-sm text-gray-400">Sensor</span>
                                <h3 className="text-lg font-semibold">{sensor.label}</h3>
                            </div>
                        </div>

                        {/* VALUE */}
                        <div className="mb-3">
                            <span className="text-4xl font-bold">{sensor.value}</span>
                            <span className="text-gray-400 ml-1 text-sm">{sensor.unit}</span>
                        </div>


                    </div>

                </li>)
            }
        </div>


        <div className="w-full bg-[#1f2530] p-6 rounded-xl shadow-md border border-[#2a323e]">
            <h2 className="text-xl font-semibold mb-4">Sensor Monitoring</h2>

            <LineChart width={1100} height={400} data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a323e"/>
                <XAxis dataKey="time" stroke="#ccc"/>
                <YAxis stroke="#ccc"/>
                <Tooltip/>
                <Legend/>

                {/* TEMPERATURE */}
                <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Temperature (°C)"
                />

                {/* HUMIDITY */}
                <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Humidity (%)"
                />

                {/* LIGHT */}
                <Line
                    type="monotone"
                    dataKey="light"
                    stroke="#eab308"
                    strokeWidth={2}
                    name="Light (%)"
                />
            </LineChart>
        </div>
    </div>
}

export default Dashboard;