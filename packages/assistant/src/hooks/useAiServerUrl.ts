import { useState, useCallback } from "react";

export function useAiServerUrl(initialValue = "http://localhost:8000"): [string, (newValue: string) => void] {
    const [value, _setValue] = useState(() => {
        return localStorage.getItem("aiServerUrl") ?? initialValue;
    });

    const setValue = useCallback((newValue: string) => {
        _setValue(newValue);
        localStorage.setItem("aiServerUrl", newValue);
    }, []);

    return [value, setValue];
}
