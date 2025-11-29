import {useFetch} from "../hooks/useFetch.ts";
import type {User} from "../types/User.ts";


export function usePostUser() {
    return useFetch<User>(
        "http://localhost:3000/api/users",
        "POST"
    )
}

export function useGetUsers() {
    return useFetch<User[]>("http://localhost:3000/api/users", "GET"
    )
}

export function useDeleteUser() {
    return useFetch<null>(
        `http://localhost:3000/api/users`,
        "DELETE"
    )
}

export function usePutUser() {
    return useFetch<User>(
        `http://localhost:3000/api/users`,
        "PUT"
    )
}