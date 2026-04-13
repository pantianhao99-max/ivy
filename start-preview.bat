@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process powershell -WindowStyle Hidden -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','%~dp0serve-static.ps1','-Port','8108'"
timeout /t 2 /nobreak >nul
start "" "http://localhost:8108/"
start "" "http://localhost:8108/examples/style-guide.html"
echo Preview launching at http://localhost:8108/ and http://localhost:8108/examples/style-guide.html
exit /b 0
