@echo off
REM cd /d "%~dp0"
echo ======================================================
echo Installing dependencies...
"D:\batchui\oct27\python_profile\backend\venv\Scripts\python.exe" -m pip install --upgrade pip
"D:\batchui\oct27\python_profile\backend\venv\Scripts\python.exe" -m pip install -r requirements.txt
echo ======================================================
echo Starting Flask app...
"D:\batchui\oct27\python_profile\backend\venv\Scripts\python.exe" "app.py" --no-debug