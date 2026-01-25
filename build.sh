#!/bin/bash
set -o errexit

echo "Building React frontend..."
cd frontend-react
npm install
npm run build
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