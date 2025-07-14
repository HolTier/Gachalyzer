import psycopg2
import os
import json
import select
import redis

PG_CONN = {
    "dbname": os.getenv("POSTGRES_DB"),
    "user": os.getenv("POSTGRES_USER"),
    "password": os.getenv("POSTGRES_PASSWORD"),
    "host": os.getenv("POSTGRES_HOST", "localhost"),
}

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")

def main():
    # Connect to PostgreSQL
    try:
        pg_conn = psycopg2.connect(**PG_CONN)
        pg_conn.autocommit = True
        print("Connected to PostgreSQL")
    except Exception as e:
        print(f"Error connecting to PostgreSQL: {e}")
        return

    # Connect to Redis
    try:
        redis_client = redis.StrictRedis(host=REDIS_HOST, decode_responses=True)
        print("Connected to Redis")
    except Exception as e:
        print(f"Error connecting to Redis: {e}")
        return

    # Example of using the connections
    # Here you can add your logic to interact with PostgreSQL and Redis

if __name__ == "__main__":
    main()