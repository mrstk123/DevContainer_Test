# DevContainer: ASP.NET Core + Angular

Full-stack dev environment running entirely inside a [Dev Container](https://containers.dev/).

## Why use a Dev Container?

- **Consistent Environments:** Everyone on the team uses the exact same OS, tools, and dependencies (like Node 24 and .NET 10). It eliminates the "works on my machine" problem.
- **Zero Local Setup:** You don't need to manually install .NET SDKs or Node on your personal computer. Everything is sandboxed inside the container.
- **Seamless Onboarding:** New developers can just open the repository, click "Reopen in Container", and immediately start coding.

## Tech Stack

| Piece    | Tech                                             | Port |
| -------- | ------------------------------------------------ | ---- |
| Backend  | ASP.NET Core minimal API (.NET 10)               | 5000 |
| Frontend | Angular 22 (zoneless, standalone, Vitest tests)  | 4200 |

## Getting started

1. Open the repo in VS Code and choose **Reopen in Container** from the popup, or open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`), type **Dev Containers: Reopen in Container**, and hit enter.
   (requires the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)).
2. The container builds with .NET 10 + Node 24 and runs `dotnet restore` and `npm install` for you (`postCreateCommand`).
3. **Dev Servers Auto-Start:** By default, the `start-all` task will automatically run when the workspace opens, starting both the backend and frontend servers in separate terminal tabs.
   - **How to disable/enable auto-run:** You can easily turn this off globally for your machine without changing any code. Open the VS Code Command Palette (`Cmd+Shift+P` on Mac or `Ctrl+Shift+P` on Windows), search for **`Tasks: Manage Automatic Tasks`**, and choose **Disallow Automatic Tasks** (or **Allow** to turn it back on).

To start them manually at any time: Go to **Terminal → Run Task**, and select `start-all`, `run-backend`, or `run-frontend`.

## How the apps talk

The Angular dev server proxies `/api/*` to the backend (`Frontend/proxy.conf.json`),
so no CORS is needed:

```
Browser → http://localhost:4200/api/weatherforecast
        → (dev proxy) → http://localhost:5000/api/weatherforecast
```

## Endpoints

| Route                  | Description                          |
| ---------------------- | ------------------------------------ |
| `GET /health`          | Liveness check                       |
| `GET /api/weatherforecast` | Sample weather data              |
| `GET /openapi/v1.json` | OpenAPI document (Development only)  |

## Database (Postgres)

The backend connects to a Postgres container running on the host via Docker.
Connection details are **not committed** — each developer keeps them in
`.devcontainer/.env` (git-ignored):

```bash
cp .devcontainer/.env.example .devcontainer/.env   # then fill in the password
```

The file is injected into the dev container as environment variables
(`runArgs: --env-file`) and read by the backend as `ConnectionStrings:Default`.
It takes effect on the next **Reopen/Rebuild Container**.

Check connectivity at any time via `GET /health`, which includes a live
Postgres `SELECT 1` check (`Unhealthy` when no connection string is set up or the DB is down).

### Where the connection string comes from

| Where the backend runs | Source of `ConnectionStrings:Default` |
| ---------------------- | ------------------------------------- |
| Inside dev container   | `.devcontainer/.env` (injected via `runArgs`) — uses `host.docker.internal`, overrides appsettings |
| Local VS Code / host   | `Backend/appsettings.Development.json` — uses `localhost` |

Precedence: environment variables (container) override appsettings, so no
manual switching is needed between the two environments.

## Common commands

```bash
# Backend (from Backend/)
dotnet run --urls http://0.0.0.0:5000
dotnet build

# Frontend (from Frontend/)
npx ng serve --host 0.0.0.0 --port 4200
npx ng build          # production build
npx ng test           # unit tests (Vitest, watch mode)
npx ng test --watch=false   # single run
```

## Project structure

```
.devcontainer/devcontainer.json   # Container image, features, extensions, port labels
.vscode/tasks.json                # Auto-start tasks for both servers
Backend/                          # ASP.NET Core minimal API
Frontend/                         # Angular workspace
└── proxy.conf.json               # /api → localhost:5000 dev proxy
```
