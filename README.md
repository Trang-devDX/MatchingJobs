# MatchingJobs — Job Matching Platform


### Frontend

- **Job Seeker Portal (frontend/public)** - Public-facing application for job seekers to browse and search for job opportunities, view job details, and apply for positions
- **Company Portal (frontend/company)** - Employer portal for companies to post job listings, manage applications, and handle recruitment processes
- **Admin Portal (frontend/admin)** - Administrative interface for system administrators to manage users, companies, job postings, and system settings

### Backend

- **Laravel API (backend)** - API backend built with Laravel 12 that serves the frontend applications and handles business logic and database operations

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

- **Backend**: Laravel 12 with PHP 8.3-FPM
- **Frontend**: React/TypeScript Node 20+
- **Database**: PostgreSQL 12.7
- **Cache**: Redis 7
- **Storage**: Laravel local disk by default; S3-compatible storage can be configured separately
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

- Create the backend environment file

  ```bash
  cp backend/.env.example backend/.env
  ```

- Install Laravel dependencies

  ```bash
  docker compose run --rm --no-deps --user www-data api composer install
  ```

- Generate the Laravel application key

  ```bash
  docker compose run --rm --no-deps --user www-data api php artisan key:generate
  ```

- Start PostgreSQL, Redis, and Mailcatcher, then create the database tables

  ```bash
  docker compose up -d psql redis mailcatcher
  docker compose run --rm --user www-data api php artisan migrate
  ```

- Build and start the Docker services

  ```bash
  docker compose up -d --build --remove-orphans
  ```

The default PostgreSQL database and user are both `matchingjobs`; the password is `abcd1234`. To change these values, set `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` in the repository root `.env`; Compose passes the same values to Laravel. The database port is published on localhost only.

- To run a frontend locally with Vite instead of its Docker/Nginx image, install its dependencies with Yarn:

  ```bash
  for app in public company admin; do
    (cd "frontend/$app" && yarn install --immutable)
  done
  ```

- File uploads use Laravel's local disk by default. To use S3-compatible storage, configure the `AWS_*` values in `backend/.env` and create the bucket in that storage provider.

- Access the applications:

  - **Public Frontend**: [http://localhost:5175](http://localhost:5175)
  - **Company Frontend**: [http://localhost:5174](http://localhost:5174)
  - **Admin Frontend**: [http://localhost:5173](http://localhost:5173)
  - **API Backend**: [http://localhost:8000](http://localhost:8000)
  - **Swagger API Docs**: [http://localhost:8081](http://localhost:8081)

- **Note**: If applications don't load properly, rebuild the containers:

  ```bash
  docker compose up -d --build --remove-orphans
  ```

### PHP Package Updates

When PHP packages are added during development, run:

```bash
docker compose exec --user www-data api composer install
```

### Database Migration

When database schema changes are made during development:

```bash
docker compose exec --user www-data api php artisan migrate
```

### Database Seed

When database seed is needed during development:

```bash
docker compose exec --user www-data api php artisan db:seed
```

### Database Reset

To reset the database during development:

```bash
docker compose exec --user www-data api php artisan migrate:fresh --seed
```

### Xdebug with PhpStorm

1. Enable xdebug by setting environment variable:

   ```bash
   XDEBUG_MODE=debug,coverage
   ```

2. Restart Docker containers:

   ```bash
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
docker compose exec --user www-data api php artisan queue:work
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
docker compose exec --user www-data api php artisan ide-helper:generate
docker compose exec --user www-data api php artisan ide-helper:models -N
docker compose exec --user www-data api php artisan ide-helper:meta
```

### Additional Commands

**View logs**:

```bash
docker compose logs -f
```

**Shell access**:

```bash
docker compose exec --user www-data api sh
```

**Container status**:

```bash
docker compose ps
```

**Format code**:

```bash
docker compose exec --user www-data api vendor/bin/php-cs-fixer fix
```

**Restart workers**:

```bash
docker compose exec --user www-data api php artisan queue:restart
```

**Stop containers**:

```bash
docker compose down
```

**Stop containers and remove volumes**:

```bash
docker compose down -v
```
