def handle(payload: str, redis_client):
    redis_client.delete("games:all")
    print(f"LISTENER: [GAMES] Cache cleared for all games")