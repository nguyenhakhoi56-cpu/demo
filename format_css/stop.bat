@echo off
title Stop CSS Multi-Watcher
taskkill /f /im node.exe >nul 2>&1
echo [OK] CSS Multi-Watcher has been stopped successfully!
timeout /t 2 >nul
