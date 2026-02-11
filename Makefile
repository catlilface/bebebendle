# Makefile for Bebebendle Docker operations

.PHONY: help build up down logs shell test clean

# Default target
help:
	@echo "Available commands:"
	@echo "  make build    - Build all Docker images"
	@echo "  make up       - Start all services"
	@echo "  make down     - Stop all services"
	@echo "  make logs     - View logs from all services"
	@echo "  make shell    - Open shell in frontend container"
	@echo "  make migrate  - Run database migrations"
	@echo "  make clean    - Remove all containers and volumes"
	@echo "  make restart  - Restart all services"

# Build all images
build:
	docker-compose build

# Start services
up:
	docker-compose up -d

# Build and start
up-build:
	docker-compose up -d --build

# Stop services
down:
	docker-compose down

# Stop and remove volumes
down-volumes:
	docker-compose down -v

# View logs
logs:
	docker-compose logs -f

# Frontend logs
logs-frontend:
	docker-compose logs -f frontend

# Bot logs
logs-bot:
	docker-compose logs -f bot

# Open shell in frontend
shell-frontend:
	docker-compose exec frontend sh

# Open shell in bot
shell-bot:
	docker-compose exec bot bash

# Run database migrations
migrate:
	docker-compose exec frontend bunx drizzle-kit migrate

# Generate migration
generate-migration:
	docker-compose exec frontend bunx drizzle-kit generate

# Restart services
restart:
	docker-compose restart

# Clean everything (WARNING: removes database!)
clean:
	docker-compose down -v --rmi all

# Backup database
backup:
	@mkdir -p backups
	@cp db/bebendle.sqlite backups/bebendle-$$(date +%Y%m%d-%H%M%S).sqlite
	@echo "Backup created in backups/"

# Check status
status:
	docker-compose ps

# Validate configuration
config:
	docker-compose config
