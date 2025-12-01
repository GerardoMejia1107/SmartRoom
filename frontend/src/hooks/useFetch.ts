import {useState, useCallback} from "react";
import toast from "react-hot-toast";

const DEFAULT_FETCH_OPTIONS = {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
};

type CommonFetch = {
    input?: Record<string, any>;
    fetchOptions?: RequestInit;
    urlParams?: string;
};

export function useFetch<T>(
    baseUrl: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
) {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);

    const commonFetch = useCallback(async ({
                                               input,
                                               fetchOptions = {},
                                               urlParams = ""
                                           }: CommonFetch) => {

        setIsLoading(true);
        setError(null);

        try {
            const fullUrl = `${baseUrl}${urlParams}`;

            const response = await fetch(fullUrl, {
                method,
                ...DEFAULT_FETCH_OPTIONS,
                ...fetchOptions,
                body:
                    method === "GET" || method === "DELETE"
                        ? undefined
                        : JSON.stringify(input)
            });

            const json = await response.json();
            setData(json);

            if (method !== "GET") {
                toast.success(
                    method === "POST" ? "Creado exitosamente" :
                        method === "PUT" ? "Actualizado exitosamente" :
                            method === "DELETE" ? "Eliminado exitosamente" :
                                "Operación exitosa"
                );
            }
            return json;

        } catch (err: any) {
            const msg = err.message || "Error inesperado";
            setError(err.message || "Unknown fetch error");
            toast.error(msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [baseUrl, method]); // deps estables

    return {isLoading, data, error, commonFetch};
}
