# AppDelPalestrato

A comprehensive fitness training management system backend built with FastAPI, PostgreSQL, and Docker.

## Features

- User authentication with JWT (access and refresh tokens)
- Role-based access control (Admin, Coach, Athlete)
- Exercise library management
- Training plan creation and assignment
- Workout logging and progress tracking
- Password recovery system

## Prerequisites

- Docker
- Docker Compose

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd appdelpalestrato
```

2. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/appdelpalestrato
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
SUPERUSER_EMAIL=admin@example.com
SUPERUSER_PASSWORD=admin123
```

3. Build and start the containers:
```bash
docker-compose up --build
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the application is running, you can access:
- Swagger UI documentation: `http://localhost:8000/docs`
- ReDoc documentation: `http://localhost:8000/redoc`

## Project Structure

```
app/
├── core/
│   ├── config.py
│   ├── database.py
│   ├── security.py
│   └── init_db.py
├── models/
│   ├── user.py
│   ├── exercise.py
│   ├── plan.py
│   └── workout_log.py
├── routers/
│   ├── auth.py
│   ├── users.py
│   ├── exercises.py
│   ├── plans.py
│   └── workout_logs.py
├── schemas/
│   └── ...
└── services/
    └── ...
```

## Development

To run the application in development mode:

```bash
docker-compose up --build
```

The application will automatically reload when you make changes to the code.

## Testing

To run tests:

```bash
docker-compose run web pytest
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 