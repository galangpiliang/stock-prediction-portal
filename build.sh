#!/bin/bash
set -o errexit

# Build frontend
echo "Building React frontend..."
cd frontend-react
npm install
npm run build
cd ..

# Prepare static files from React build
echo "Preparing frontend static files..."
mkdir -p backend-drf/staticfiles
cp -r frontend-react/dist/* backend-drf/staticfiles/ || true

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend-drf
pip install -r requirements.txt

# Collect static files
echo "Collecting Django static files..."
python manage.py collectstatic --noinput --clear

# Run migrations
echo "Running migrations..."
python manage.py migrate

echo "Build complete!"
