@echo off
set ZIP_PATH=%~dp0n8n-dist.zip
start "" "%~dp0Pody 1.0.0.exe" --n8n-zip="%ZIP_PATH%"
