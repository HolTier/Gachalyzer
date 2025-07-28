"""API configuration module for OCR service."""

import os
from typing import Dict


class APIConfig:
    """Centralized API configuration for the OCR service."""
    
    def __init__(self):
        self.base_url = os.getenv("API_URL")
        if not self.base_url:
            raise ValueError("API_URL environment variable is required")
        
        # Ensure the URL doesn't end with a slash for consistent endpoint building
        self.base_url = self.base_url.rstrip('/')
    
    @property
    def endpoints(self) -> Dict[str, str]:
        """Get all API endpoints."""
        return {
            "artifact_names": f"{self.base_url}/initdata/init-game-artifact-name",
            "game_stats": f"{self.base_url}/initdata/init-game-stat",
            "stat_types": f"{self.base_url}/initdata/init-stat-type",
            "games": f"{self.base_url}/initdata/init-game",
        }
    
    def get_endpoint(self, endpoint_name: str) -> str:
        """Get a specific endpoint URL."""
        endpoints = self.endpoints
        if endpoint_name not in endpoints:
            raise ValueError(f"Unknown endpoint: {endpoint_name}. Available endpoints: {list(endpoints.keys())}")
        return endpoints[endpoint_name]
    
    def get_artifact_names_url(self) -> str:
        """Get the artifact names endpoint URL."""
        return self.get_endpoint("artifact_names")
    
    def get_game_stats_url(self) -> str:
        """Get the game stats endpoint URL."""
        return self.get_endpoint("game_stats")
    
    def get_stat_types_url(self) -> str:
        """Get the stat types endpoint URL."""
        return self.get_endpoint("stat_types")
    
    def get_games_url(self) -> str:
        """Get the games endpoint URL."""
        return self.get_endpoint("games")


# Global instance
api_config = APIConfig()
