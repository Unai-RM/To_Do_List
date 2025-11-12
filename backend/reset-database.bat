@echo off
echo ====================================
echo   RESETEAR BASE DE DATOS
echo ====================================
echo.
echo Limpiando base de datos...
node clean-database.js

echo.
echo Cargando datos de demostracion...
call npx sequelize-cli db:seed:all

echo.
echo ====================================
echo   PROCESO COMPLETADO
echo ====================================
echo.
pause
