#!/bin/bash
# Mathionix CRM Infrastructure Initialization

echo "Initializing CRM Development Environment..."

# Clean up any existing instances
docker-compose down -v

# Start MongoDB first
docker-compose up -d mongodb

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to start..."
sleep 10

# Build and start services
docker-compose up --build -d api web

echo "CRM Services started successfully!"
echo "Web: http://localhost:3000"
echo "API: http://localhost:3001"
echo "MongoDB: localhost:27017"
