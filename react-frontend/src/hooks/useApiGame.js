import { useState, useEffect } from "react";
import { API_CONFIG } from "../config/api";

const EXPIRATION_MS = 24 * 60 * 60 * 1000;

export function useApiGame(dataType = "stats") {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let endpoint, cacheKey, timestampKey;
        
        switch (dataType) {
            case "stats":
                endpoint = API_CONFIG.ENDPOINTS.INIT_GAME_STATS;
                cacheKey = "api-game-data";
                timestampKey = "api-game-data-timestamp";
                break;
            case "artifacts":
                endpoint = API_CONFIG.ENDPOINTS.INIT_GAME_ARTIFACT_NAMES;
                cacheKey = "api-artifact-data";
                timestampKey = "api-artifact-data-timestamp";
                break;
            case "game":
                endpoint = API_CONFIG.ENDPOINTS.INIT_GAME;
                cacheKey = "api-init-game-data";
                timestampKey = "api-init-game-data-timestamp";
                break;
            case "elements":
                endpoint = API_CONFIG.ENDPOINTS.INIT_CHARACTER_ELEMENTS;
                cacheKey = "api-elements-data";
                timestampKey = "api-elements-data-timestamp";
                break;
            case "weapons":
                endpoint = API_CONFIG.ENDPOINTS.INIT_CHARACTER_WEAPON_TYPES;
                cacheKey = "api-weapons-data";
                timestampKey = "api-weapons-data-timestamp";
                break;
            case "wuwa":
                endpoint = API_CONFIG.ENDPOINTS.INIT_WUWA;
                cacheKey = "api-wuwa-data";
                timestampKey = "api-wuwa-data-timestamp";
                break;
            default:
                endpoint = API_CONFIG.ENDPOINTS.INIT_GAME_STATS;
                cacheKey = "api-game-data";
                timestampKey = "api-game-data-timestamp";
        }

        const cached = localStorage.getItem(cacheKey);
        const timestamp = localStorage.getItem(timestampKey);
        
        if (dataType === "stats") {
            console.log("Cached: " + cached);
        }

        const isFresh = cached && timestamp &&
            (Date.now() - parseInt(timestamp, 10)) < EXPIRATION_MS;

        if (isFresh) {
            const parsed = JSON.parse(cached);
            if (dataType === "stats") {
                console.log("Parsed DATA: ", parsed);
            }
            setData(parsed);
            setLoading(false);
        } else {
            fetch(API_CONFIG.BASE_URL + endpoint)
                .then(res => res.json())
                .then(json => {
                    localStorage.setItem(cacheKey, JSON.stringify(json));
                    localStorage.setItem(timestampKey, Date.now().toString());
                    setData(json);
                })
                .catch(setError)
                .finally(() => setLoading(false));
        }
    }, [dataType]);

    return { data, loading, error };
} 