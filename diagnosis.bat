cd "C:\Users\Koman\Documents\PROJECT\Developer\Plugin figma\turn 3D"

echo Checking files...
dir dist
echo.

echo Checking structure...
dir src\plugin
echo.

dir src\ui
echo.

echo Node version:
node --version
echo.

echo NPM version:
npm --version
echo.

echo Building...
npm run build