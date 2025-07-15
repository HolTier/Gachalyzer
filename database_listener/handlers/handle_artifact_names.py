def handle(payload: str, redis_client):
    """
    Handle artifact names update notifications from PostgreSQL.
    Clears relevant Redis cache based on the payload content.
    """
    
    # Handle game-specific artifact cache invalidation
    if payload.startswith("game:"):
        game_id = payload.split(":", 1)[1]
        redis_client.delete(f"artifact:game:{game_id}")
        redis_client.delete("artifact:all")
        print(f"LISTENER: [ARTIFACT_NAMES] Cache cleared for game '{game_id}' and all artifacts")
    
    # Handle global artifact cache invalidation
    elif payload == "all":
        redis_client.delete("artifact:all")
        print(f"LISTENER: [ARTIFACT_NAMES] Global artifact cache cleared")
    
    # Handle unknown payload format
    else:
        print(f"LISTENER: [ARTIFACT_NAMES] [WARN] Unknown payload format: '{payload}'")