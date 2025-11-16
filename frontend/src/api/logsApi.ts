import {useFetch} from "../hooks/useFetch.ts";
import type {Logs} from "../types/Logs.ts";


export function useGetLogs() {
    return useFetch<Logs[]>(
        {
            url: "http://localhost:3000/api/logs",
            method: "GET"
        }
    )
}