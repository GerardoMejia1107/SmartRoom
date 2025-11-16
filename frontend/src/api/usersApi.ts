import {useFetch} from "../hooks/useFetch.ts";
import type {User} from "../types/User.ts";


export function usePostUser() {
    return useFetch<User>({
        url: "http://localhost:3000/api/users",
        method: "POST"
    })
}

export function useGetUsers() {
    return useFetch<User[]>({
        url: "http://localhost:3000/api/users",
        method: "GET"
    })
}