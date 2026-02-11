# 🤖 Bebebendle Telegram Bot (Python + aiogram)

Python implementation of the Telegram bot for Bebebendle using aiogram framework.

## 📋 Requirements

- Python 3.11+
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- Same SQLite database as the frontend (`../db/bebendle.sqlite`)

## 🚀 Quick Start

### 1. Install uv

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Setup Environment

```bash
cd bot
cp .env.example .env
```

Edit `.env` and add your bot token from @BotFather:
```env
BOT_TOKEN=your_bot_token_here
```

### 3. Install Dependencies

```bash
uv sync
```

### 4. Run the Bot

```bash
uv run python src/main.py
```

## 📁 Structure

```
bot/
├── src/
│   ├── __init__.py      # Package initialization
│   ├── main.py          # Bot entry point with handlers
│   └── database.py      # Database connection module
├── .env                 # Environment variables (not in git)
├── .env.example         # Example environment file
├── pyproject.toml       # Project configuration and dependencies
└── README.md            # This file
```

## 🎯 Features

- **/start** - Welcome message
- **/suggest** - Multi-step wizard to suggest new scran
  1. Photo upload
  2. Name input
  3. Description (optional)
  4. Price
  5. Confirmation
- **/status** - Check your suggestions status
- **/help** - Show help information

## 🗄️ Database

The bot connects to the same SQLite database as the Next.js frontend:
- **Path**: `../db/bebendle.sqlite` (relative to bot directory)
- **Table**: `scrans` with `telegram_id` field for tracking authors
- **Library**: `aiosqlite` for async SQLite operations

When a user suggests a scran:
- `approved` is set to `0` (false)
- `telegram_id` stores the user's Telegram ID
- Admin can approve it via the web admin panel

## 🛠️ Development

### Install dev dependencies

```bash
uv sync --extra dev
```

### Run linter

```bash
uv run ruff check src/
uv run ruff check --fix src/
```

### Run type checker

```bash
uv run mypy src/
```

### Run tests

```bash
uv run pytest
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BOT_TOKEN` | Telegram bot token from @BotFather | Yes |

### Bot Commands

Set up commands in BotFather:

```
start - Запустить бота
suggest - Предложить блюдо
status - Проверить статус предложений
help - Показать помощь
```

## 📱 Bot Flow

1. User sends `/suggest`
2. Bot asks for photo
3. Bot asks for name (2-100 chars)
4. Bot asks for description (optional, max 500 chars)
5. Bot asks for price (0-1,000,000 rubles)
6. Bot shows preview and asks for confirmation
7. On confirmation, saves to database with `approved=false`
8. Admin can approve via web panel at `/admin`

## 🔗 Integration with Frontend

The bot and frontend share the same database:
- Frontend reads scrans for the daily game
- Bot inserts new scrans as "pending"
- Admin panel (frontend) shows pending scrans for approval
- Once approved, scran becomes available for the daily game

## 📝 Notes

- User sessions are stored in memory (FSMContext from aiogram)
- Sessions timeout after being inactive (handled by aiogram)
- Database connections are managed per-operation using async context managers
- The bot uses polling mode (no webhook setup required for local development)

## 🐛 Troubleshooting

**Bot doesn't start?**
- Check if `BOT_TOKEN` is set in `.env`
- Verify database file exists at `../db/bebendle.sqlite`

**Database errors?**
- Ensure migrations are run in the main project: `bunx drizzle-kit migrate`
- Check file permissions on the database

**Import errors?**
- Make sure you're running from the `bot` directory
- Use `uv run python src/main.py` instead of `python src/main.py`
