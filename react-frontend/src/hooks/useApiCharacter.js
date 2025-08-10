import { useState, useEffect } from "react";
import { API_CONFIG } from "../config/api";

export function useApiCharacter(dataType = "elements") {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let endpoint;
        
        switch (dataType) {
            case "character_show":
                endpoint = API_CONFIG.ENDPOINTS.GET_CHARACTER_SHOW;
                break;
            default:
                endpoint = API_CONFIG.ENDPOINTS.GET_CHARACTER_SHOW;
        }

        setLoading(true);
        setError(null);

        fetch(API_CONFIG.BASE_URL + endpoint)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(json => {
                setData(json);
            })
            .catch(err => {
                setError(err);
                setData(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [dataType]);

    return { data, loading, error };
}