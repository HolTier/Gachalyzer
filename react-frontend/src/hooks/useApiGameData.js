import { useState, useEffect } from "react";
import { API_CONFIG } from "../config/api";

const EXPIRATION_MS = 24 * 60 * 60 * 1000;

export function useApiGameData() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cached = localStorage.getItem("api-game-data");
        const timestamp = localStorage.getItem("api-game-data-timestamp");
        console.log("Cached: " + cached);

        const isFresh = cached && timestamp &&
            (Date.now() - parseInt(timestamp, 10)) < EXPIRATION_MS;

        if (isFresh) {
            const parsed = JSON.parse(cached);
            console.log("Parsed DATA: ", parsed);
            setData(parsed);
            setLoading(false);
        } else {
            fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.INIT_GAME_STATS)
                .then(res => res.json())
                .then(json => {
                    const arr = Array.isArray(json) ? json : json.data;
                    localStorage.setItem("api-game-data", JSON.stringify(json));
                    localStorage.setItem("api-game-data-timestamp", Date.now().toString());
                    setData(json);
                })
                .catch(setError)
                .finally(() => setLoading(false));
        }
    }, []);

    return { data, loading, error };
}