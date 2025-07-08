import { useState, useEffect } from "react";

const EXPIRATION_MS = 24 * 60 * 60 * 1000;

export function useApiGameData() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cached = localStorage.getItem("api-game-data");
        const timestamp = localStorage.getItem("api-game-data-timestamp");

        const isFresh = cached && timestamp &&
            (Date.now() - parseInt(timestamp, 10)) < EXPIRATION_MS;

        if (isFresh) {
            setData(JSON.parse(cached));
            setLoading(false);
        } else {
            fetch("http://127.0.0.1:8080/api/InitData/init-game-stats")
                .then(res => res.json())
                .then(json => {
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