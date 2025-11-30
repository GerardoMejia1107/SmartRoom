import {useFetch} from "../hooks/useFetch.ts";
import type {Alerts} from "../types/Alerts.ts";

export function useGetAlerts() {
    return useFetch<Alerts[]>(
        "http://localhost:3000/api/alerts",
        "GET"
    )
}

export function useDeleteAlert() {
    return useFetch(
        `http://localhost:3000/api/alerts`,
        "DELETE",
    )
}

