export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8080/api",
    ENDPOINTS: {
        OCR_UPLOAD_MULTIPLE: "/Ocr/upload-multiple",
        INIT_GAME_STATS: "/InitData/init-game-stats",
        INIT_WUWA: "/InitData/initWuwa"
    }
};