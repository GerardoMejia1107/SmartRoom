import {Link, Outlet, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    Thermometer, Lightbulb, DoorOpen, AlertTriangle, SunSnow, GamepadIcon
} from "lucide-react";

export default function Layout() {
    const [time, setTime] = useState("")
    const location = useLocation()

    useEffect(() => {
        const updateClock = () => {
            const now = new Date()
            setTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                })
            )
        }
        updateClock()
        const interval = setInterval(updateClock, 1000)
        return () => clearInterval(interval)
    }, []);

    const navItems = [
        {name: "Dashboards", icon: <Thermometer size={16}/>, path: "/"},
        {name: "Controles", icon: <GamepadIcon size={16}/>, path: "/controls"},
        {name: "Accesos", icon: <DoorOpen size={16}/>, path: "/access"},
        {name: "Eventos", icon: <AlertTriangle size={16}/>, path: "/events"}
    ]

    return (
        <div className="min-h-screen w-full bg-[#13171c] text-white flex flex-col">

            {/* HEADER */}
            <header className="fixed top-0 left-0 z-50 w-full bg-[#1f2530] px-8 py-4 shadow-lg border-b border-[#2b3340]">
                <div className=" flex items-center justify-between">

                    {/* LEFT */}
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 p-2 rounded-xl shadow-md shadow-blue-500/30">
                            <Lightbulb size={28} className="text-white"/>
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-wide">Smartroom IoT</h1>
                            <p className="text-gray-400 text-sm">Sistema de Control Inteligente</p>
                        </div>
                    </div>

                    {/* NAV */}
                    <nav className="flex gap-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium 
                                    transition-all duration-200 border border-transparent
                                    ${
                                    location.pathname === item.path
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/40 border-blue-400"
                                        : "bg-[#2a323e] text-gray-300 hover:bg-[#3a4452] hover:text-white hover:border-[#485365]"
                                }
                                    hover:scale-[1.03]
                                `}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* CLOCK */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-300 font-mono">{time}</span>

                        <div className="p-3 bg-[#2A323E] rounded-xl shadow-inner shadow-black/40">
                            <SunSnow size={18} className="text-yellow-300"/>
                        </div>
                    </div>
                </div>
            </header>

            {/* CONTENT */}
            <main className="flex-1 w-full min-h-screen bg-[#181d23] pt-16 px-8 mt-20">
                <Outlet/>
            </main>
        </div>
    )
}
