import psycopg2
import os
import json
import select
import redis

from handlers.handle_artifact_names import handle as handle_artifact_names

CHANNEL_HANDLERS = {
    "artifact_names_update": handle_artifact_names,
}

PG_CONN = {
    "dbname": os.getenv("POSTGRES_DB", "postgres"),
    "user": os.getenv("POSTGRES_USER", "postgres"),
    "password": os.getenv("POSTGRES_PASSWORD", "postrgres"),
    "host": os.getenv("POSTGRES_HOST", "localhost"),
}

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")

def main():
    redis_client = redis.Redis(host=REDIS_HOST, port=6379)
    
    conn = psycopg2.connect(**PG_CONN)
    conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()

    for channel in CHANNEL_HANDLERS:
        cursor.execute(f"LISTEN {channel}")
        print(f"LISTENER: [INIT] Subscribed to channel '{channel}'")
    print(f"LISTENER: [INIT] Starting PostgreSQL notification listener...")
    
    while True:
        if select.select([conn], [], [], 10) == ([], [], []):
            continue

        conn.poll()
        
        while conn.notifies:
            notify = conn.notifies.pop(0)
            print(f"LISTENER: [PG-NOTIFY] channel={notify.channel} payload={notify.payload}")

            handler = CHANNEL_HANDLERS.get(notify.channel)
            if handler:
                try:
                    handler(notify.payload, redis_client)
                    print(f"LISTENER: [SUCCESS] Handler executed for channel '{notify.channel}'")
                except Exception as e:
                    print(f"LISTENER: [ERROR] Handler failed for channel '{notify.channel}': {str(e)}")
            else:
                print(f"LISTENER: [WARN] No handler found for channel '{notify.channel}'")


if __name__ == "__main__":
    main()