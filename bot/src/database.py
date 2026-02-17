"""Database module for connecting to the shared PostgreSQL database."""

import logging
import os
from typing import Optional

import asyncpg

logger = logging.getLogger(__name__)


class Database:
    """Async database connection handler for PostgreSQL."""

    def __init__(self):
        """Initialize database connection."""
        self.connection: Optional[asyncpg.Connection] = None
        self.pool: Optional[asyncpg.Pool] = None

    async def connect(self) -> None:
        """Establish database connection pool."""
        host = os.getenv("POSTGRES_HOST", "db")
        port = int(os.getenv("POSTGRES_PORT", "5432"))
        database = os.getenv("POSTGRES_DB", "bebendle")
        user = os.getenv("POSTGRES_USER", "postgres")
        password = os.getenv("POSTGRES_PASSWORD", "postgres")

        self.pool = await asyncpg.create_pool(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password,
            min_size=1,
            max_size=10,
        )
        logger.debug(f"Connected to PostgreSQL database: {database}@{host}:{port}")

    async def close(self) -> None:
        """Close database connection pool."""
        if self.pool:
            await self.pool.close()
            self.pool = None
            logger.debug("Database connection pool closed")

    async def insert_scran(
        self, image_url: str, name: str, description: str | None, price: float, telegram_id: str
    ) -> int:
        """Insert a new scran into the database.

        Args:
            image_url: URL to the scran image
            name: Name of the scran
            description: Optional description
            price: Price in rubles
            telegram_id: Telegram user ID who suggested it

        Returns:
            ID of the inserted scran
        """
        if not self.pool:
            raise RuntimeError("Database not connected")

        async with self.pool.acquire() as connection:
            scran_id = await connection.fetchval(
                """
                INSERT INTO scrans (
                    image_url, name, description, price, 
                    number_of_likes, number_of_dislikes, approved, telegram_id
                ) VALUES ($1, $2, $3, $4, 0, 0, false, $5)
                RETURNING id
                """,
                image_url,
                name,
                description,
                price,
                telegram_id,
            )

        if scran_id is None:
            raise RuntimeError("Failed to get ID after insert")
        logger.info(f"Inserted scran with ID {scran_id}: {name}")
        return scran_id

    async def get_user_scrans(self, telegram_id: str) -> list[dict]:
        """Get all scrans suggested by a specific user.

        Args:
            telegram_id: Telegram user ID

        Returns:
            List of scran dictionaries
        """
        if not self.pool:
            raise RuntimeError("Database not connected")

        async with self.pool.acquire() as connection:
            rows = await connection.fetch(
                """
                SELECT id, name, approved
                FROM scrans
                WHERE telegram_id = $1
                ORDER BY id DESC
                LIMIT 20
                """,
                telegram_id,
            )

        return [
            {
                "id": row["id"],
                "name": row["name"],
                "approved": row["approved"],
            }
            for row in rows
        ]

    async def get_scran_by_id(self, scran_id: int) -> Optional[dict]:
        """Get a scran by its ID.

        Args:
            scran_id: Scran ID

        Returns:
            Scran dictionary or None if not found
        """
        if not self.pool:
            raise RuntimeError("Database not connected")

        async with self.pool.acquire() as connection:
            row = await connection.fetchrow(
                "SELECT id, name, approved, telegram_id FROM scrans WHERE id = $1",
                scran_id,
            )

        if not row:
            return None

        return {
            "id": row["id"],
            "name": row["name"],
            "approved": row["approved"],
            "telegram_id": row["telegram_id"],
        }

    async def approve_scran(self, scran_id: int) -> bool:
        """Approve a scran.

        Args:
            scran_id: Scran ID to approve

        Returns:
            True if approved successfully
        """
        if not self.pool:
            raise RuntimeError("Database not connected")

        async with self.pool.acquire() as connection:
            await connection.execute(
                "UPDATE scrans SET approved = true WHERE id = $1",
                scran_id,
            )

        logger.info(f"Approved scran {scran_id}")
        return True

    async def get_least_voted_scrans(self, limit: int = 10) -> list[dict]:
        """Get scrans with least votes (likes + dislikes).

        Args:
            limit: Number of scrans to return

        Returns:
            List of scran dictionaries with image_url
        """
        if not self.pool:
            raise RuntimeError("Database not connected")

        async with self.pool.acquire() as connection:
            rows = await connection.fetch(
                """
                SELECT id, image_url, name, description, price,
                       number_of_likes, number_of_dislikes,
                       (number_of_likes + number_of_dislikes) as total_votes
                FROM scrans
                WHERE approved = true
                ORDER BY total_votes ASC, RANDOM()
                LIMIT $1
                """,
                limit,
            )

        return [
            {
                "id": row["id"],
                "image_url": row["image_url"],
                "name": row["name"],
                "description": row["description"],
                "price": row["price"],
                "number_of_likes": row["number_of_likes"],
                "number_of_dislikes": row["number_of_dislikes"],
            }
            for row in rows
        ]

    async def get_random_scran(self, exclude_id: int | None = None) -> dict | None:
        """Get a random approved scran.

        Args:
            exclude_id: Optional scran ID to exclude

        Returns:
            Scran dictionary or None if not found
        """
        if not self.pool:
            raise RuntimeError("Database not connected")

        async with self.pool.acquire() as connection:
            if exclude_id:
                row = await connection.fetchrow(
                    """
                    SELECT id, image_url, name, description, price,
                           number_of_likes, number_of_dislikes
                    FROM scrans
                    WHERE approved = true AND id != $1
                    ORDER BY RANDOM()
                    LIMIT 1
                    """,
                    exclude_id,
                )
            else:
                row = await connection.fetchrow(
                    """
                    SELECT id, image_url, name, description, price,
                           number_of_likes, number_of_dislikes
                    FROM scrans
                    WHERE approved = true
                    ORDER BY RANDOM()
                    LIMIT 1
                    """,
                )

        if not row:
            return None

        return {
            "id": row["id"],
            "image_url": row["image_url"],
            "name": row["name"],
            "description": row["description"],
            "price": row["price"],
            "number_of_likes": row["number_of_likes"],
            "number_of_dislikes": row["number_of_dislikes"],
        }

    async def vote_for_scran(self, scran_id: int, is_like: bool) -> bool:
        """Add a like or dislike to a scran.

        Args:
            scran_id: Scran ID to vote for
            is_like: True for like, False for dislike

        Returns:
            True if vote was recorded successfully
        """
        if not self.pool:
            raise RuntimeError("Database not connected")

        column = "number_of_likes" if is_like else "number_of_dislikes"

        async with self.pool.acquire() as connection:
            await connection.execute(
                f"""
                UPDATE scrans
                SET {column} = {column} + 1
                WHERE id = $1
                """,
                scran_id,
            )

        logger.info(f"{'Like' if is_like else 'Dislike'} added to scran {scran_id}")
        return True

    async def get_voted_scran_ids(self, telegram_id: str) -> list[int]:
        """Get all scran IDs that a user has voted for.

        Args:
            telegram_id: Telegram user ID

        Returns:
            List of scran IDs
        """
        if not self.pool:
            raise RuntimeError("Database not connected")

        async with self.pool.acquire() as connection:
            rows = await connection.fetch(
                """
                SELECT scran_id
                FROM telegram_votes
                WHERE telegram_id = $1
                """,
                telegram_id,
            )

        return [row["scran_id"] for row in rows]

    async def record_telegram_vote(self, telegram_id: str, scran_id: int, is_like: bool) -> None:
        """Record a vote from Telegram user.

        Args:
            telegram_id: Telegram user ID
            scran_id: Scran ID that was voted for
            is_like: True for like, False for dislike
        """
        if not self.pool:
            raise RuntimeError("Database not connected")

        async with self.pool.acquire() as connection:
            await connection.execute(
                """
                INSERT INTO telegram_votes (telegram_id, scran_id, is_like, created_at)
                VALUES ($1, $2, $3, NOW())
                """,
                telegram_id,
                scran_id,
                is_like,
            )

        logger.info(f"Telegram vote recorded: user {telegram_id}, scran {scran_id}, like={is_like}")
