# MeterMitra

MeterMitra is a Java Spring Boot and Angular learning project for an auto rickshaw operations system.

It is designed for someone moving from data engineering/product work into software engineering:

- Spring Boot REST API with layered architecture
- Angular UI with clean dashboard-style screens
- In-memory H2 database for easy local development
- Seed data so the app has life as soon as it starts
- Simple business logic for ride status and fare estimates

## Project Structure

```text
MeterMitra
├── backend   Spring Boot API
└── frontend  Angular UI
```

## What You Are Learning

### Backend

- `Controller`: receives HTTP requests and returns responses.
- `Service`: owns business logic like assigning rides and estimating fares.
- `Repository`: talks to the database through Spring Data JPA.
- `Entity`: maps Java objects to database tables.
- `DTO`: shapes data sent over the API so frontend and backend have a clean contract.

### Frontend

- `Component`: reusable UI unit.
- `Service`: Angular class for calling backend APIs.
- `Model`: TypeScript interface describing API data.
- `Routing`: URL-driven navigation between dashboard, drivers, and rides.

## Run Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

### SQL Rationalizer AI

The SQL Rationalizer can run an optional local model through Ollama. Install Ollama, download the configured model, and start the Ollama service:

```powershell
ollama pull qwen3.5:4b
ollama serve
```

The backend defaults to `qwen3.5:4b` at `http://localhost:11434/api/chat`. A larger `qwen3.5:9b` model is also installed on the development machine; set `SQL_ANALYZER_MODEL=qwen3.5:9b` to select it if you prefer quality over response time. Override the endpoint with `OLLAMA_CHAT_ENDPOINT` if needed. SQL and schema are sent only to the local Ollama service; the analyzer does not connect to a database or execute queries.

Useful endpoints:

```text
GET  /api/dashboard
GET  /api/drivers
GET  /api/rickshaws
GET  /api/rides
POST /api/rides
POST /api/fares/estimate
```

H2 console:

```text
http://localhost:8080/h2-console
```

Use:

```text
JDBC URL: jdbc:h2:mem:metermitra
User: sa
Password:
```

## Run Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```text
http://localhost:4200
```

## GitHub Pages

The `.github/workflows/pages.yml` workflow builds and publishes the Angular frontend at the site root. It runs on pushes to `main` or `master`, or manually from the GitHub Actions tab. In the repository's **Settings → Pages**, set the build and deployment source to **GitHub Actions**.

GitHub Pages serves static files only. The Spring Boot API is not included, so API-backed dashboard, ride, driver, fare, and SQL features need a separately hosted backend. The frontend currently targets `http://localhost:8080/api`.

## Suggested Learning Path

1. Start the backend and open `/api/dashboard`.
2. Read `RideService.java` and understand how a ride is created.
3. Read `DataSeeder.java` and see how sample data is inserted.
4. Start Angular and trace `DashboardComponent` to `RickshawApiService`.
5. Add one small feature, such as cancelling a ride or filtering rides by status.

