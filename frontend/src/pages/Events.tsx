import {DoorClosed, DoorOpen, TrashIcon, AlertTriangle} from "lucide-react";
import {useEffect} from "react";

import {useDeleteLog, useGetLogs} from "../api/logsApi.ts";
import {useDeleteAlert, useGetAlerts} from "../api/alertsApi.ts";

function Events() {
    const {isLoading, commonFetch, data: logs} = useGetLogs();
    const {isLoading: isLoadingAlerts, commonFetch: commonFetchAlerts, data: alerts} = useGetAlerts()

    const {commonFetch: deleteStoredLogs} = useDeleteLog()

    const {commonFetch: deleteStoredAlerts} = useDeleteAlert();

    async function deleteLog(uid: string) {
        await deleteStoredLogs({urlParams: `/${uid}`});

        await commonFetch({});
    }

    async function deleteAlert(uid: string) {
        await deleteStoredAlerts({urlParams: `/${uid}`});

        await commonFetchAlerts({});
    }


    useEffect(() => {
        commonFetch({});
        commonFetchAlerts({});
    }, []);


    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pb-10">

            {/* TITLE */}
            <h2 className="text-2xl font-bold mb-2">Registro de Eventos</h2>

            {/* =============== LOGS =============== */}
            <div className="bg-[#1e2532] rounded-xl border border-[#2a3240] overflow-hidden">

                <h3 className="text-xl font-semibold p-4 border-b border-[#2a3240]">
                    Logs
                </h3>

                {isLoading ? (
                    <p className="p-4 text-gray-400">Cargando logs...</p>
                ) : (
                    logs?.map((log, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-4 border-b border-[#2a3240] last:border-b-0 hover:bg-[#252d3a]/40 transition-colors"
                        >
                            {/* LEFT BLOCK */}
                            <div className="flex items-center gap-4">

                                {/* ICON */}
                                <div
                                    className={`p-3 rounded-lg flex items-center justify-center
                                    ${log.authorized ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}
                                >
                                    {log.authorized ? <DoorOpen size={22}/> : <DoorClosed size={22}/>}
                                </div>

                                {/* USER DATA */}
                                <div className="flex flex-col leading-tight">
                                    <span className="font-semibold text-white">
                                        {log.uid || "Usuario desconocido"}
                                    </span>
                                    <span className="text-gray-400 text-xs">
                                        RFID: {log.uid}
                                    </span>
                                </div>
                            </div>

                            {/* RIGHT BLOCK */}
                            <div className="flex items-center gap-4">

                                {/* STATUS */}
                                <div className="text-right leading-tight">
                                    <span
                                        className={`font-semibold block text-sm
                                        ${log.authorized ? "text-green-400" : "text-red-400"}`}
                                    >
                                        {log.authorized ? "ACCESS GRANTED" : "ACCESS DENIED"}
                                    </span>
                                    <span className="text-gray-400 text-xs">
                                        {log.timestamp}
                                    </span>
                                </div>

                                {/* DELETE */}
                                <button className="text-gray-400 hover:text-red-400 transition" onClick={async () => {
                                    // @ts-ignore
                                    await deleteLog(log?._id)
                                }}>
                                    <TrashIcon size={20}/>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* =============== ALERTS =============== */}
            <div className="bg-[#1e2532] rounded-xl border border-[#2a3240] overflow-hidden">

                <h3 className="text-xl font-semibold p-4 border-b border-[#2a3240]">
                    Alerts
                </h3>

                {isLoadingAlerts ? (
                    <p className="p-4 text-gray-400">Cargando alerts...</p>
                ) : (
                    alerts?.map((alert, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-4 border-b border-[#2a3240] last:border-b-0 hover:bg-[#252d3a]/40 transition-colors"
                        >
                            {/* LEFT BLOCK */}
                            <div className="flex items-center gap-4">

                                {/* ICON */}
                                <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400">
                                    <AlertTriangle size={22}/>
                                </div>

                                {/* ALERT TEXT */}
                                <div className="flex flex-col leading-tight">
                                    <span className="font-semibold text-white">
                                        {alert.type}
                                    </span>
                                    <span className="text-gray-400 text-xs">
                                        {alert.description}
                                    </span>
                                </div>
                            </div>

                            {/* RIGHT BLOCK */}
                            <div className="flex items-center gap-4">

                                {/* STATUS */}
                                <div className="text-right leading-tight">
                                    <span className="text-yellow-400 font-semibold block text-sm">
                                        ALERT
                                    </span>
                                    <span className="text-gray-400 text-xs">
                                        {alert.timestamp}
                                    </span>
                                </div>

                                {/* DELETE */}
                                <button className="text-gray-400 hover:text-red-400 transition" onClick={async () => {
                                    // @ts-ignore
                                    await deleteAlert(alert?._id)
                                }}>
                                    <TrashIcon size={20}/>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}

export default Events;
