# Harukky Job Search Application


### Frontend

- **Job Seeker Portal (frontend/public)** - Public-facing application for job seekers to browse and search for job opportunities, view job details, and apply for positions
- **Company Portal (frontend/company)** - Employer portal for companies to post job listings, manage applications, and handle recruitment processes
- **Admin Portal (frontend/admin)** - Administrative interface for system administrators to manage users, companies, job postings, and system settings

### Backend

- **Laravel API (backend)** - RESTful API backend built with Laravel 11 that serves all frontend applications, handles business logic, database operations, and third-party integrations

## System Architecture Diagram

```
┌────────────────────────────────────────────────────────┐
│               FRONTEND (Cloudfront + S3)               │
├─────────────────┬─────────────────┬────────────────────┤
│    Job Seeker   │      Company    │       Admin        │
└─────────┬───────┴─────────┬───────┴─────────┬──────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                    ┌───────▼───────┐
                    │     NGINX     │
                    │  Web Server   │
                    └───────┬───────┘
                            │
                    ┌───────▼───────┐
                    │  LARAVEL API  │
                    │  (EC2 + RDS)  │
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼───────┐   ┌───────▼───────┐   ┌───────▼───────┐
│  PostgreSQL   │   │    Redis 7    │   │      S3       │
│   Database    │   │     Cache     │   │   Storage     │
└───────────────┘   └───────────────┘   └───────────────┘
```

# Architecture

- **Backend**: Laravel 11 with PHP 8.3-FPM
- **Frontend**: React/TypeScript Node 20+
- **Database**: PostgreSQL 12.7
- **Cache**: Redis 7
- **Storage**: MinIO (S3-compatible)
- **Web Server**: Nginx
- **Email Testing**: Mailcatcher
- **API Documentation**: Swagger UI

## PHP Modules

The following PHP modules are required for the backend:

- **pdo_pgsql** - PostgreSQL database connection
- **mbstring** - Multi-byte string handling
- **bcmath** - Arbitrary precision mathematics
- **pcntl** - Process control
- **zip** - ZIP archive handling
- **intl** - Internationalization
- **gd** - Image processing
- **opcache** - Performance optimization
- **exif** - Image metadata extraction
- **redis** - Redis cache support
- **xdebug** - Development debugging

# Local Development Setup

- Clone this repository to any directory

  ```bash
  git clone https://github.com/neos-fukuoka/harukky.git
  cd harukky
  ```

- Create file environment variables

  ```bash
  cp .env.example .env
  cp backend/.env.example backend/.env
  cp frontend/public/.env.example frontend/public/.env
  cp frontend/company/.env.example frontend/company/.env
  cp frontend/admin/.env.example frontend/admin/.env
  ```

- Install laravel dependencies

  ```bash
  docker compose run --rm api composer install
  ```

- Start the development environment

  ```bash
  make up

  # Or without Make:
  docker compose up -d --remove-orphans
  ```

- Create S3 buckets in MinIO

  Access MinIO Console at [http://localhost:9001](http://localhost:9001)

  **Login credentials:**

  - Username: `minio` (or check MINIO_ROOT_USER in .env)
  - Password: `minio123` (or check MINIO_ROOT_PASSWORD in .env)

  **Create required buckets:**

  - `harukky-files` - for files

- Access the applications:

  - **Public Frontend**: [http://localhost:5175](http://localhost:5175)
  - **Company Frontend**: [http://localhost:5174](http://localhost:5174)
  - **Admin Frontend**: [http://localhost:5173](http://localhost:5173)
  - **API Backend**: [http://localhost:8000](http://localhost:8000)
  - **Swagger API Docs**: [http://localhost:8081](http://localhost:8081)

- **Note**: If applications don't load properly, rebuild the containers:

  ```bash
  make build
  make up

  # Or without Make:
  docker compose build
  docker compose up -d --remove-orphans
  ```

### PHP Package Updates

When PHP packages are added during development, run:

```bash
make command:api command="composer install"

# Or without Make:
docker compose exec api composer install
```

### Database Migration

When database schema changes are made during development:

```bash
make command:api command="php artisan migrate"

# Or without Make:
docker compose exec api php artisan migrate
```

### Database Seed

When database seed is needed during development:

```bash
make command:api command="php artisan db:seed"

# Or without Make:
docker compose exec api php artisan db:seed
```

### Database Reset

To reset the database during development:

```bash
make command:api command="php artisan migrate:fresh --seed"

# Or without Make:
docker compose exec api php artisan migrate:fresh --seed
```

### Xdebug with PhpStorm

1. Enable xdebug by setting environment variable:

   ```bash
   XDEBUG_MODE=debug,coverage
   ```

2. Restart Docker containers:

   ```bash
   make down-up
   # Or without Make:
   docker compose down
   docker compose up -d --remove-orphans
   ```

3. Configure PhpStorm following this guide:
   https://www.jetbrains.com/help/phpstorm/debugging-with-phpstorm-ultimate-guide.html
   - Set up remote PHP interpreter
   - Configure path mappings: `/usr/share/nginx/html/laravel` → `./backend`

### Queue Processing

Email sending uses Laravel's [queue system](https://laravel.com/docs/queues).
To process emails, start the queue worker:

```bash
make command:api command="php artisan queue:work"

# Or without Make:
docker compose exec api php artisan queue:work
```

### Local Mail Testing Environment

The development environment includes [Mailcatcher](https://mailcatcher.me/) for email testing.
After starting Docker, access the mail interface at:
http://localhost:1080

All sent emails will appear here for testing and debugging.

### IDE Helper

To improve IDE autocompletion, we use [Laravel IDE Helper](https://github.com/barryvdh/laravel-ide-helper).

When models are modified, regenerate helper files:

```bash
make ide_helper

# Or without Make:
docker compose exec api php artisan ide-helper:generate
docker compose exec api php artisan ide-helper:models -N
docker compose exec api php artisan ide-helper:meta
```

### Additional Commands

**View logs**:

```bash
make logs

# Or without Make:
docker compose logs -f
```

**Shell access**:

```bash
make shell:api

# Or without Make:
docker compose exec api sh
```

**Container status**:

```bash
make ps

# Or without Make:
docker compose ps
```

**Format code**:

```bash
make formatter

# Or without Make:
docker compose exec api vendor/bin/php-cs-fixer fix
```

**Restart workers**:

```bash
make restart_worker

# Or without Make:
docker compose exec api php artisan queue:restart
```

**Stop containers**:

```bash
make down
# Or without Make:

docker compose down
```

**Stop containers and remove volumes**:

```bash
make down:with-volumes

# Or without Make:
docker compose down -v
```

For all available Make commands, run:

```bash
make help
```
