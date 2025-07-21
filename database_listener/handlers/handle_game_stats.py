def handle(payload: str, redis_client):
    if payload.startswith("game:"):
        game_id = payload.split(":", 1)[1]
        redis_client.delete(f"game_stats:game:{game_id}")
        redis_client.delete("game_stats:all")
        print(f"LISTENER: [GAME_STATS] Cache cleared for game '{game_id}' and all game stats")
    elif payload == "all":
        redis_client.delete("game_stats:all")
        print(f"LISTENER: [GAME_STATS] Global game stats cache cleared")
    else:
        print(f"LISTENER: [GAME_STATS] [WARN] Unknown payload format: '{payload}'")
    