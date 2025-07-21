def handle(payload: str, redis_client):
    if payload.startswith("game:"):
        game_id = payload.split(":", 1)[1]
        redis_client.delete(f"artifact:game:{game_id}")
        redis_client.delete("artifact:all")
        print(f"LISTENER: [ARTIFACT_NAMES] Cache cleared for game '{game_id}' and all artifacts")
    elif payload == "all":
        redis_client.delete("artifact:all")
        print(f"LISTENER: [ARTIFACT_NAMES] Global artifact cache cleared")
    else:
        print(f"LISTENER: [ARTIFACT_NAMES] [WARN] Unknown payload format: '{payload}'")