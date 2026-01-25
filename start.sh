#!/bin/bash
set -o errexit

cd backend-drf
gunicorn stock_prediction_main.wsgi:application --bind 127.0.0.1:8000

