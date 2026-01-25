# backend-drf/create_admin.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stock_prediction_main.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Remove the default strings. 
# If the variable is missing, it will return None and the script will fail safely.
username = os.getenv('DJANGO_SUPERUSER_USERNAME')
email = os.getenv('DJANGO_SUPERUSER_EMAIL')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD')

if not username or not password:
    print("Error: Superuser environment variables are missing. Skipping creation.")
else:
    if not User.objects.filter(username=username).exists():
        print(f"Creating superuser: {username}")
        User.objects.create_superuser(username=username, email=email, password=password)
    else:
        print(f"Superuser {username} already exists.")