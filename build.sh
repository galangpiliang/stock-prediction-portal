#!/bin/bash
set -o errexit

echo "Building React frontend..."
cd frontend-react
npm install

# DEBUG: This will show up in your Render build logs
echo "Injecting API URL: $VITE_BACKEND_BASE_API"

# Explicitly pass the env var into the build command
VITE_BACKEND_BASE_API=$VITE_BACKEND_BASE_API npm run build
cd ..

echo "Preparing frontend static files..."
rm -rf backend-drf/staticfiles
mkdir -p backend-drf/staticfiles
cp -r frontend-react/dist/* backend-drf/staticfiles/

echo "Installing backend dependencies..."
cd backend-drf
pip install -r requirements.txt

echo "Collecting Django static files..."
python manage.py collectstatic --noinput --clear

echo "Running migrations..."
python manage.py migrate
echo "Build process completed successfully."