
import { useState, useCallback } from 'react';

type GeminiServiceFunction<T, P> = (params: P) => Promise<T>;

export const useGemini = <T, P>(serviceFunction: GeminiServiceFunction<T, P>) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (params: P) => {
        setIsLoading(true);
        setError(null);
        setData(null);
        try {
            const response = await serviceFunction(params);
            setData(response);
            return response;
        } catch (err: any) {
            setError(err.message || 'حصل خطأ غير متوقع');
        } finally {
            setIsLoading(false);
        }
    }, [serviceFunction]);

    return { data, isLoading, error, execute };
};
