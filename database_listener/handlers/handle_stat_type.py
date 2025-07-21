def handle(payload: str, redis_client):
    redis_client.delete("game_stats:all")
    redis_client.delete("stat_types:all")
    print(f"LISTENER: [STAT_TYPES] Cache cleared for all game stats and stat types")