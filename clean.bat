@echo off
echo ========================================
echo   Figma 3D Text Plugin - Clean
echo ========================================
echo.
echo This will delete:
echo - dist/ folder
echo - node_modules/ folder
echo.
set /p confirm="Are you sure? (Y/N): "

if /i "%confirm%"=="Y" (
    echo.
    echo Cleaning...
    
    if exist "dist" (
        echo Deleting dist/...
        rmdir /s /q "dist"
        echo [OK] dist/ deleted
    ) else (
        echo [SKIP] dist/ not found
    )
    
    if exist "node_modules" (
        echo Deleting node_modules/...
        rmdir /s /q "node_modules"
        echo [OK] node_modules/ deleted
    ) else (
        echo [SKIP] node_modules/ not found
    )
    
    echo.
    echo ========================================
    echo   Clean Complete!
    echo ========================================
    echo.
    echo Run setup.bat to reinstall and rebuild.
    echo.
) else (
    echo.
    echo Clean cancelled.
    echo.
)

pause