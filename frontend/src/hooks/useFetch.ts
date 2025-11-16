import {useState} from "react";

const DEFAULT_FETCH_OPTIONS = {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
}

type UseFetchProps = {
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE"
}

type CommonFetch = {
    input?: { [index: string]: any };
    fetchOptions?: RequestInit
}

export function useFetch<T>({url, method}: UseFetchProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState<T | null>(null)

    const commonFetch = async ({
                                   input, fetchOptions = {},
                               }: CommonFetch) => {
        setIsLoading(true)
        const response = await fetch(url, {
            method,
            ...DEFAULT_FETCH_OPTIONS,
            ...fetchOptions,
            body: method === "GET" ? undefined : JSON.stringify(input)
        })
        const data = await response.json()
        setIsLoading(false)
        setData(data)
    }
    return {isLoading, commonFetch, data}

}