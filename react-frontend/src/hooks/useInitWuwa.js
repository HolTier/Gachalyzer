import { useEffect, useState } from "react";
import { API_CONFIG } from "../config/api";

const INIT_WUWA_KEY = "initWuwaData";

export function useInitWuwa() {
    const [dataWuwa, setDataWuwa] = useState(null);
    const [loadingWuwa, setLoadingWuwa] = useState(true);

    useEffect(() => {
        const cached = sessionStorage.getItem(INIT_WUWA_KEY);

        if(cached && cached !== "undefined") {
            console.log("Cached Wuwa:" + cached);
            setDataWuwa(JSON.parse(cached));
            setLoadingWuwa(false);
        } else {
            fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.INIT_WUWA)
                .then(res =>{
                    if(!res.ok){
                        console.log("throwed");
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then(result => {
                    
                    sessionStorage.setItem(INIT_WUWA_KEY, JSON.stringify(result));
                    console.log("InitWuwa: " + JSON.stringify(result));
                    setDataWuwa(result);
                })
                .catch(console.error)
                .finally(() => setLoadingWuwa(false));
        }
    },[]);

    return { dataWuwa, loadingWuwa }
 }