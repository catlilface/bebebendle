# Bot Dockerfile for Python Telegram Bot with uv
FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim

# Set working directory
WORKDIR /app

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies using uv
RUN uv sync --no-dev

# Copy source code
COPY src/ ./src/

# Set environment
ENV PATH="/app/.venv/bin:${PATH}"
ENV PYTHONPATH="/app/src"

# Run the bot
CMD ["python", "src/main.py"]
