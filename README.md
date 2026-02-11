This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🤖 Telegram Bot

This project includes a Python Telegram bot for users to suggest new food items.

### Bot Features
- **/suggest** - Multi-step wizard to submit new scran with photo, name, description, and price
- **/status** - Check status of pending suggestions
- **/help** - Show help information

### Bot Setup

The bot is located in the `bot/` directory and uses:
- **Python 3.11+** with [uv](https://docs.astral.sh/uv/) package manager
- **aiogram** - Async Telegram Bot framework
- **aiosqlite** - Async SQLite driver
- Shared database with the web frontend

See [bot/README.md](bot/README.md) for detailed setup instructions.

### Quick Start

```bash
cd bot
cp .env.example .env
# Edit .env and add your BOT_TOKEN
uv sync
uv run python src/main.py
```

The bot connects to the same SQLite database (`db/bebendle.sqlite`) as the Next.js frontend, allowing seamless integration between user submissions and the admin approval workflow.

## 🐳 Docker Setup

The easiest way to run the entire application (frontend + bot) is using Docker Compose.

### Quick Start with Docker

```bash
# 1. Clone the repository
git clone <repository-url>
cd bebebendle

# 2. Setup environment
cp .env.example .env
# Edit .env with your BOT_TOKEN, ADMIN_PASSWORD, and CRON_SECRET

# 3. Start all services
docker-compose up --build -d

# 4. Access the application
# Frontend: http://localhost:3000
# Admin: http://localhost:3000/admin
```

### Docker Services

- **frontend** - Next.js application (port 3000)
- **bot** - Python Telegram bot
- **db-backup** (optional) - Automated database backups

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart with updates
docker-compose up -d --build

# Access database shell
docker-compose exec frontend bunx drizzle-kit migrate
```

See [DOCKER.md](DOCKER.md) for detailed Docker documentation.
