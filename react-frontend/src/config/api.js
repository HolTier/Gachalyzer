export const API_CONFIG = {
    SHORT_URL: process.env.REACT_APP_API_URL || "http://localhost:8080",
    BASE_URL: (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_ENTRYPOINT) 
        ? (process.env.REACT_APP_API_URL + process.env.REACT_APP_API_ENTRYPOINT)
        : (process.env.REACT_APP_API_URL || "http://localhost:8080") + "/api",
    ENDPOINTS: {
        OCR_UPLOAD_MULTIPLE: "/Ocr/upload-multiple",
        INIT_GAME: "/InitData/init-game",
        INIT_GAME_STATS: "/InitData/init-game-stats",
        INIT_GAME_ARTIFACT_NAMES: "/InitData/init-game-artifact-name",
        INIT_WUWA: "/InitData/initWuwa",
        INIT_CHARACTER_ELEMENTS: "/InitData/init-character-elements",
        INIT_CHARACTER_WEAPON_TYPES: "/InitData/init-character-weapon-types",
        INIT_CHARACTER_STAT_TYPES: "/InitData/init-character-stat-types",

        ADD_CHARACTER: "/Character/add-character",
        GET_CHARACTER_SHOW: "/Character/get-characters",
        UPDATE_CHARACTER: "/Character/update-character/",
        DELETE_CHARACTER: "/Character/delete-character/",

        IMAGE_PAGES: "/Image/image-by-page",
        ALL_TAGS: "/Image/all-tags"
    }
};