"""Database module for connecting to the shared SQLite database."""

import logging
from typing import Optional

import aiosqlite

logger = logging.getLogger(__name__)


class Database:
    """Async database connection handler."""

    def __init__(self, db_path: str):
        """Initialize database connection.

        Args:
            db_path: Path to SQLite database file (relative to bot directory)
        """
        self.db_path = db_path
        self.connection: Optional[aiosqlite.Connection] = None

    async def connect(self) -> None:
        """Establish database connection."""
        self.connection = await aiosqlite.connect(self.db_path)
        # Enable foreign keys
        await self.connection.execute("PRAGMA foreign_keys = ON")
        logger.debug(f"Connected to database: {self.db_path}")

    async def close(self) -> None:
        """Close database connection."""
        if self.connection:
            await self.connection.close()
            self.connection = None
            logger.debug("Database connection closed")

    async def insert_scran(
        self,
        image_url: str,
        name: str,
        description: Optional[str],
        price: float,
        telegram_id: str,
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
        if not self.connection:
            raise RuntimeError("Database not connected")

        cursor = await self.connection.execute(
            """
            INSERT INTO scrans (
                image_url, name, description, price, 
                number_of_likes, number_of_dislikes, approved, telegram_id
            ) VALUES (?, ?, ?, ?, 0, 0, 0, ?)
            """,
            (image_url, name, description, price, telegram_id),
        )
        await self.connection.commit()

        scran_id = cursor.lastrowid
        if scran_id is None:
            raise RuntimeError("Failed to get last row ID after insert")
        logger.info(f"Inserted scran with ID {scran_id}: {name}")
        return scran_id

    async def get_user_scrans(self, telegram_id: str) -> list[dict]:
        """Get all scrans suggested by a specific user.

        Args:
            telegram_id: Telegram user ID

        Returns:
            List of scran dictionaries
        """
        if not self.connection:
            raise RuntimeError("Database not connected")

        async with self.connection.execute(
            """
            SELECT id, name, approved 
            FROM scrans 
            WHERE telegram_id = ?
            ORDER BY id DESC
            LIMIT 20
            """,
            (telegram_id,),
        ) as cursor:
            rows = await cursor.fetchall()

        return [
            {
                "id": row[0],
                "name": row[1],
                "approved": bool(row[2]),
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
        if not self.connection:
            raise RuntimeError("Database not connected")

        async with self.connection.execute(
            "SELECT id, name, approved, telegram_id FROM scrans WHERE id = ?",
            (scran_id,),
        ) as cursor:
            row = await cursor.fetchone()

        if not row:
            return None

        return {
            "id": row[0],
            "name": row[1],
            "approved": bool(row[2]),
            "telegram_id": row[3],
        }

    async def approve_scran(self, scran_id: int) -> bool:
        """Approve a scran.

        Args:
            scran_id: Scran ID to approve

        Returns:
            True if approved successfully
        """
        if not self.connection:
            raise RuntimeError("Database not connected")

        await self.connection.execute(
            "UPDATE scrans SET approved = 1 WHERE id = ?",
            (scran_id,),
        )
        await self.connection.commit()

        logger.info(f"Approved scran {scran_id}")
        return True
