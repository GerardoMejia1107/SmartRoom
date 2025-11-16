import {DoorClosed, DoorOpen} from "lucide-react";
import {useEffect} from "react";

import {useGetLogs} from "../api/logsApi.ts";
import {useGetAlerts} from "../api/alertsApi.ts";

function Events() {
    const {isLoading, commonFetch, data: logs} = useGetLogs();
    const {isLoading: isLoadingAlerts, commonFetch: commonFetchAlerts, data: alerts} = useGetAlerts()

    useEffect(() => {
        commonFetch({});
        commonFetchAlerts({});

    }, []);


    return (
        <>
            <div className="w-full max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Registro de Eventos</h2>

                {/* LOGS */}
                <div className="bg-[#1e2532] rounded-xl overflow-hidden mb-6">

                    <h3 className="text-lg font-semibold p-4 border-b border-[#2a3240]">
                        Logs
                    </h3>

                    {isLoading ? (
                        <p className="p-4">Loading logs...</p>
                    ) : (
                        logs?.map((log, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-4 border-b border-[#2a3240] last:border-b-0"
                            >
                                {/* LEFT */}
                                <div className="flex items-center gap-4">
                                    {/* ICON */}
                                    {log.authorized ? (
                                        <div className="text-green-500 bg-green-500/10 p-2 rounded-lg">
                                            <DoorOpen size={24}/>
                                        </div>
                                    ) : (
                                        <div className="text-red-500 bg-red-500/10 p-2 rounded-lg">
                                            <DoorClosed size={24}/>
                                        </div>
                                    )}

                                    {/* UID */}
                                    <div className="flex flex-col">
                  <span className="font-semibold text-white">
                    {log.uid || "Usuario desconocido"}
                  </span>
                                        <span className="text-gray-400 text-sm">
                    RFID: {log.uid}
                  </span>
                                    </div>
                                </div>

                                {/* RIGHT */}
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
                        ))
                    )}
                </div>

                {/* ALERTS */}
                <div className="bg-[#1e2532] rounded-xl overflow-hidden">

                    <h3 className="text-lg font-semibold p-4 border-b border-[#2a3240]">
                        Alerts
                    </h3>

                    {isLoadingAlerts ? (
                        <p className="p-4">Loading alerts...</p>
                    ) : (
                        alerts?.map((alert, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-4 border-b border-[#2a3240] last:border-b-0"
                            >
                                {/* LEFT */}
                                <div className="flex flex-col text-white">
                                    <span className="font-semibold">{alert.type}</span>
                                    <span className="text-gray-400 text-sm">{alert.description}</span>
                                </div>

                                {/* RIGHT */}
                                <div className="text-right">
                <span className="text-yellow-400 font-semibold">
                  ALERT
                </span>

                                    <div className="text-gray-400 text-sm">
                                        {alert.timestamp}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </div>
        </>
    );


}


export default Events