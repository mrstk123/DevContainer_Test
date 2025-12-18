#!/bin/bash

# 1. Kill any existing processes (prevents "Port already in use" errors on reload)
pkill -f "dotnet run" || true
pkill -f "ng serve" || true

# () tells sh "Go into this folder, run the command, and then immediately 'teleport' back to where you were."
# 2. Start Backend
echo "🚀 Starting .NET Backend..."
(cd Backend && dotnet run --urls http://0.0.0.0:5000) &

# 3. Start Frontend
echo "📦 Starting Angular Frontend..."
(cd Frontend && ng serve --host 0.0.0.0 --port 4200) &

# 4. Keep the script alive (optional, but helpful for logs)
wait