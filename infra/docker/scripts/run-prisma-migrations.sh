#!/usr/bin/env sh
set -eu

MIGRATION_NAME="${PRISMA_MIGRATION_NAME:-docker-compose}"

echo "Running Prisma migrate dev for API..."
yarn db:migrate:api -- --name="${MIGRATION_NAME}"

echo "Running Prisma migrate dev for ingest..."
yarn db:migrate:ingest -- --name="${MIGRATION_NAME}"

echo "Ensuring Prisma clients are generated..."
yarn db:generate:api
yarn db:generate:ingest

echo "Deploying Prisma migrations..."
yarn db:deploy:api
yarn db:deploy:ingest

echo "Migrations applied successfully."
