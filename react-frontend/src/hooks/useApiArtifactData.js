import { useState, useEffect } from "react";
import { API_CONFIG } from "../config/api";

const EXPIRATION_MS = 24 * 60 * 60 * 1000;

export function useApiArtifactData() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cached = localStorage.getItem("api-artifact-data");
        const timestamp = localStorage.getItem("api-artifact-data-timestamp");

        const isFresh = cached && timestamp &&
            (Date.now() - parseInt(timestamp, 10)) < EXPIRATION_MS;

        if (isFresh) {
            const parsed = JSON.parse(cached);
            setData(parsed);
            setLoading(false);
        } else {
            fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.INIT_GAME_ARTIFACT_NAMES)
                .then(res => res.json())
                .then(json => {
                    localStorage.setItem("api-artifact-data", JSON.stringify(json));
                    localStorage.setItem("api-artifact-data-timestamp", Date.now().toString());
                    setData(json);
                })
                .catch(setError)
                .finally(() => setLoading(false));
        }
    }, []);

    return { data, loading, error };
}
