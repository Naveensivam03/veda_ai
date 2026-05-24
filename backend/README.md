# VedaAI Backend

Express + TypeScript backend for async assignment paper generation using MongoDB, Redis, and BullMQ.

## Prerequisites

- Docker
- Docker Compose
- Bun

## Quick Start

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

This will:

- install Bun dependencies
- create `.env` from `.env.example` if missing
- build the Bun image
- start the backend API, worker, MongoDB, and Redis

## Manual Alternative

```bash
docker compose up
```

## Services

- Backend API: `http://localhost:5000`
- Worker: consumes BullMQ paper generation jobs from Redis
- Redis: exposed on `localhost:6379`
- MongoDB: exposed on `localhost:27017` with persistent volume `mongodb_data`

## Local Testing Flow

1. `POST /api/assignments`
   This queues a paper generation job and returns the assignment id with `status: "generating"`.
2. Worker consumes the BullMQ job, generates a mock paper, and saves it to MongoDB.
3. `GET /api/assignments/:id/status`
   This returns `generating`, then `completed` after the worker finishes.
4. `GET /api/papers/:assignmentId`
   This returns the generated paper document.

## Useful Commands

```bash
docker compose logs -f backend worker
docker compose down
docker compose down -v
```

`docker compose down -v` removes the MongoDB named volume and clears persisted local data.
