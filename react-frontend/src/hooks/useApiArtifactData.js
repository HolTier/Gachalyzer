import { useApiGame } from "./useApiGame";

// Legacy hook - maintained for backward compatibility
// New code should use useApiGame("artifacts") directly
export function useApiArtifactData() {
    return useApiGame("artifacts");
}
