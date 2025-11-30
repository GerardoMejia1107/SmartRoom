import {useFetch} from "../hooks/useFetch.ts";
import type {Logs} from "../types/Logs.ts";


export function useGetLogs() {
    return useFetch<Logs[]>(
        "http://localhost:3000/api/logs",
        "GET"
    )
}

export function useDeleteLog() {
    return useFetch(
        `http://localhost:3000/api/logs`,
        "DELETE",
    )
}