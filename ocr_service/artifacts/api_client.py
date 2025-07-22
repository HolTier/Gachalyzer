import requests
from typing import List


async def fetch_artifact_names(api_url: str) -> List[str]:
    try:
        response = requests.get(api_url, timeout=10)
        response.raise_for_status()

        data = response.json()

        if isinstance(data, list):
            return [item.get('name', '') for item in data if 'name' in item]
        else:
            return []
        
    except requests.RequestException as e:
        print(f"Error fetching artifact names: {e}")
        return []
