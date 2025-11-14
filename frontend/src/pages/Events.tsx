import {DeleteIcon, DoorClosed, DoorOpen, TrashIcon} from "lucide-react";
import {useEffect, useState} from "react";

function Events() {
    const [data, setData] = useState([])
    useEffect(() => {
        const loadLogs = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/logs")
                const logs = await res.json()
                setData(logs)
                console.log(logs)
            } catch (e) {
                console.error("Error: ", e)
            }
        }
        loadLogs()
    }, []);


    return <>
        <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Registro de Eventos</h2>
          

            <div className="bg-[#1e2532] rounded-xl overflow-hidden">

                {data.map((log, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between p-4 border-b border-[#2a3240] last:border-b-0"
                    >
                        {/* LEFT SIDE */}
                        <div className="flex items-center gap-4">

                            {/* ICON */}
                            {
                                log.authorized ? <div className="text-green-500 bg-green-500/10 p-2 rounded-lg">
                                    <DoorOpen size={24}/>
                                </div> : <div className="text-red-500 bg-red-500/10 p-2 rounded-lg">
                                    <DoorClosed size={24}/>
                                </div>
                            }

                            {/* USER + UID */}
                            <div className="flex flex-col">
            <span className="font-semibold text-white">
              {log.uid || "Usuario desconocido"}
            </span>

                                <span className="text-gray-400 text-sm">
              RFID: {log.uid}
            </span>
                            </div>

                        </div>

                        {/* RIGHT SIDE */}
                        <div className="text-right">
          <span
              className={
                  log.authorized
                      ? "text-green-400 font-semibold"
                      : "text-red-400 font-semibold"
              }
          >
            {log.authorized ? "ACCESS GRANTED" : "ACCESS DENIED"}
          </span>

                            <div className="text-gray-400 text-sm">
                                {log.timestamp}
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>

    </>

}

export default Events