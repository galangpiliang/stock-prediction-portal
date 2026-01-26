#!/bin/bash
set -o errexit

cd backend-drf
gunicorn stock_prediction_main.wsgi:application --workers 1 --threads 2 --timeout 120