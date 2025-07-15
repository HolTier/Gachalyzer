import psycopg2
import os
import json
import select
import redis

# Handler mapping
from handlers.handle_artifact_names import handle as handle_artifact_names

# Channels to listen to
CHANNEL_HANDLERS = {
    "artifact_names_update": handle_artifact_names,
}

# PostgreSQL connection configuration
PG_CONN = {
    "dbname": os.getenv("POSTGRES_DB"),
    "user": os.getenv("POSTGRES_USER"),
    "password": os.getenv("POSTGRES_PASSWORD"),
    "host": os.getenv("POSTGRES_HOST", "localhost"),
}

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")

def main():
    # Initialize Redis connection
    redis_client = redis.Redis(host=REDIS_HOST, port=6379)
    
    # Initialize PostgreSQL connection
    conn = psycopg2.connect(**PG_CONN)
    conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()

    # Multi channel subscription
    for channel in CHANNEL_HANDLERS:
        cursor.execute(f"LISTEN {channel}")
        print(f"LISTENER: [INIT] Subscribed to channel '{channel}'")
    print(f"LISTENER: [INIT] Starting PostgreSQL notification listener...")
    
    # Main listening loop
    while True:
        # Wait for notifications with 10 second timeout
        if select.select([conn], [], [], 10) == ([], [], []):
            continue
        # Poll for new notifications
        conn.poll()
        
        # Process all pending notifications
        while conn.notifies:
            notify = conn.notifies.pop(0)
            print(f"LISTENER: [PG-NOTIFY] channel={notify.channel} payload={notify.payload}")

            # Find and execute the appropriate handler
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