@echo off
chcp 65001 >nul
title ACCOR Reforco Escolar - Inicializador Rapido

echo ========================================================
echo   ACCOR REFORCO ESCOLAR - INICIO RAPIDO LOCAL
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/4] Liberando portas 8080 e 5173 (caso haja processos antigos)...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8080,5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }" >nul 2>&1

echo [2/4] Iniciando Backend (Spring Boot + SQLite na porta 8080)...
start "ACCOR - Backend Spring Boot (8080)" cmd /k "cd /d "%~dp0backend" && call mvnw.cmd spring-boot:run"

echo [3/4] Iniciando Frontend (React + Vite na porta 5173)...
start "ACCOR - Frontend React Vite (5173)" cmd /k "cd /d "%~dp0frontend" && call npm.cmd run dev"

echo [4/4] Aguardando servidores subirem para abrir o navegador...
timeout /t 4 /nobreak >nul
start "" "http://localhost:5173"

echo.
echo ========================================================
echo   SITE INICIADO COM SUCESSO!
echo   - Site Publico / Admin : http://localhost:5173
echo   - API Backend SQLite   : http://localhost:8080/api
echo ========================================================
echo.
pause
