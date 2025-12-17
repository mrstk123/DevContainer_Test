#!/bin/bash
cd Backend && dotnet run --urls http://0.0.0.0:5000 &
cd Frontend && ng serve --host 0.0.0.0 --port 4200 &
wait