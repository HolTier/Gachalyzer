import { useApiGame } from "./useApiGame";

// Legacy hook - maintained for backward compatibility
// New code should use useApiGame("stats") directly
export function useApiGameData() {
    return useApiGame("stats");
}