#!/bin/bash
# Quick setup script for Django backend

echo " Setting up ATS Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo " Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo " Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo " Installing dependencies..."
pip install -r requirements.txt

# Copy .env if doesn't exist
if [ ! -f ".env" ]; then
    echo " Creating .env file..."
    cp .env.example .env
    echo "  Please edit .env with your database credentials"
fi

# Run migrations
echo " Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
echo ""
echo "Do you want to create a superuser? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    python manage.py createsuperuser
fi

# Seed sample data (optional)
echo ""
echo "Do you want to create sample data? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    python manage.py shell < seed_data.py
fi

echo ""
echo " Setup complete!"
echo ""
echo "To start the development server:"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "API will be available at: http://localhost:8000"
echo "Admin panel: http://localhost:8000/admin/"
