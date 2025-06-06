#!/bin/bash

# Exit if any command fails
set -e

cd "$(dirname "$0")/.."

# Load .env if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "Stopping and removing Docker containers..."
docker-compose down -v

echo "Rebuilding containers..."
docker-compose up --build -d

echo "Waiting for the database to be ready..."
until docker exec fullstack-pizza-store-app-db-1 pg_isready -U "$POSTGRES_USER" > /dev/null 2>&1; do
  sleep 1
done

echo "Applying schema..."
docker exec -i fullstack-pizza-store-app-db-1 psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < ./api/schema.sql

echo "Seeding database..."
docker exec -i fullstack-pizza-store-app-db-1 psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < ./api/seed.sql

echo "Running API tests..."
cd api
npm run test:docker
