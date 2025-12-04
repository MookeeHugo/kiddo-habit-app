@echo off
echo ======================================
echo 推送代码到GitHub
echo ======================================
echo.

cd /d "%~dp0"

echo 步骤1: 重命名分支为main...
git branch -M main

echo.
echo 步骤2: 添加远程仓库...
git remote add origin https://github.com/MookeeHugo/kiddo-habit-app.git

echo.
echo 步骤3: 推送代码到GitHub...
git push -u origin main

echo.
echo ======================================
echo 完成！代码已推送到GitHub
echo ======================================
echo.
echo 现在你可以访问：
echo https://github.com/MookeeHugo/kiddo-habit-app
echo.
pause
