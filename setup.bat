@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ════════════════════════════════════════════════════════════
echo    Figma 3D Text Plugin - Setup Script v2.0
echo ════════════════════════════════════════════════════════════
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [❌ ERROR] Node.js is not installed!
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org/
    echo.
    echo Choose the LTS version and install with default settings.
    echo.
    pause
    exit /b 1
)

:: Display Node.js version
for /f "tokens=*" %%i in ('node --version 2^>nul') do set NODE_VERSION=%%i
echo [✓ OK] Node.js found: !NODE_VERSION!

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [❌ ERROR] npm is not installed!
    echo.
    echo Please reinstall Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Display npm version
for /f "tokens=*" %%i in ('npm --version 2^>nul') do set NPM_VERSION=%%i
echo [✓ OK] npm found: v!NPM_VERSION!
echo.

:: Check directory structure
echo [STEP 1] Checking directory structure...
echo.

set "MISSING_DIRS=0"

:: Check src/plugin
if not exist "src\plugin\" (
    echo [❌] src\plugin\ folder missing
    set "MISSING_DIRS=1"
) else (
    echo [✓] src\plugin\ found
)

if not exist "src\plugin\controller.ts" (
    echo [❌] src\plugin\controller.ts missing
    set "MISSING_DIRS=1"
) else (
    echo [✓] src\plugin\controller.ts found
)

if not exist "src\plugin\types.ts" (
    echo [❌] src\plugin\types.ts missing
    set "MISSING_DIRS=1"
) else (
    echo [✓] src\plugin\types.ts found
)

:: Check ui folder
if not exist "ui\" (
    echo [❌] ui\ folder missing
    set "MISSING_DIRS=1"
) else (
    echo [✓] ui\ found
)

if not exist "ui\components\" (
    echo [❌] ui\components\ folder missing
    set "MISSING_DIRS=1"
) else (
    echo [✓] ui\components\ found
)

if not exist "ui\ui.tsx" (
    echo [❌] ui\ui.tsx missing
    set "MISSING_DIRS=1"
) else (
    echo [✓] ui\ui.tsx found
)

if not exist "ui\app.tsx" (
    echo [❌] ui\app.tsx missing
    set "MISSING_DIRS=1"
) else (
    echo [✓] ui\app.tsx found
)

:: Check config files
if not exist "manifest.json" (
    echo [❌] manifest.json missing
    set "MISSING_DIRS=1"
) else (
    echo [✓] manifest.json found
)

if not exist "package.json" (
    echo [❌] package.json missing
    set "MISSING_DIRS=1"
) else (
    echo [✓] package.json found
)

if not exist "webpack.config.js" (
    echo [❌] webpack.config.js missing
    set "MISSING_DIRS=1"
) else (
    echo [✓] webpack.config.js found
)

if not exist "tsconfig.json" (
    echo [❌] tsconfig.json missing
    set "MISSING_DIRS=1"
) else (
    echo [✓] tsconfig.json found
)

if !MISSING_DIRS! EQU 1 (
    echo.
    echo [❌ ERROR] Some required files are missing!
    echo Please ensure all files are in the correct location.
    echo.
    pause
    exit /b 1
)

echo.
echo [✓ OK] All required files found
echo.

:: Clean old build
if exist "dist\" (
    echo [CLEANUP] Removing old dist folder...
    rmdir /s /q "dist" 2>nul
    echo [✓] Old dist removed
    echo.
)

:: Install dependencies
echo [STEP 2] Installing dependencies...
echo This may take a few minutes...
echo.

call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [❌ ERROR] npm install failed!
    echo.
    echo Try running these commands manually:
    echo   npm cache clean --force
    echo   npm install
    echo.
    pause
    exit /b 1
)

echo.
echo [✓ OK] Dependencies installed
echo.

:: Build the plugin
echo [STEP 3] Building plugin...
echo.

call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [❌ ERROR] Build failed!
    echo.
    echo Common causes:
    echo   1. TypeScript errors - check the output above
    echo   2. Missing dependencies - try running npm install again
    echo   3. Wrong import paths - check component imports
    echo.
    pause
    exit /b 1
)

echo.
echo [✓ OK] Build completed
echo.

:: Verify dist files
echo [STEP 4] Verifying build output...
echo.

set "BUILD_OK=1"

if not exist "dist\code.js" (
    echo [❌] dist\code.js not found
    set "BUILD_OK=0"
) else (
    for %%A in ("dist\code.js") do set SIZE=%%~zA
    echo [✓] dist\code.js found (!SIZE! bytes)
)

if not exist "dist\ui.js" (
    echo [❌] dist\ui.js not found
    set "BUILD_OK=0"
) else (
    for %%A in ("dist\ui.js") do set SIZE=%%~zA
    echo [✓] dist\ui.js found (!SIZE! bytes)
)

if not exist "dist\index.html" (
    echo [❌] dist\index.html not found
    set "BUILD_OK=0"
) else (
    for %%A in ("dist\index.html") do set SIZE=%%~zA
    echo [✓] dist\index.html found (!SIZE! bytes)
)

if !BUILD_OK! EQU 0 (
    echo.
    echo [❌ ERROR] Build output is incomplete!
    echo The build may have failed silently.
    echo.
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════
echo    🎉 Setup Complete!
echo ════════════════════════════════════════════════════════════
echo.
echo Next steps:
echo.
echo 1. Open Figma Desktop App
echo 2. Go to: Plugins ^> Development ^> Import plugin from manifest...
echo 3. Select the manifest.json file from this folder
echo 4. Run your plugin: Plugins ^> Development ^> Turn 3d
echo.
echo Build files ready in dist/:
echo   • dist\code.js
echo   • dist\ui.js
echo   • dist\index.html
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo For development mode (auto-rebuild):
echo   npm run dev
echo.
echo To clean and rebuild:
echo   clean.bat
echo   setup.bat
echo.
pause