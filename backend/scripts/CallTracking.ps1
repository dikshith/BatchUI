$ErrorActionPreference = "Stop"

Set-Location "D:\PERFP2\etl_wso2_build"
cmd.exe /c "scripts\calltracking.bat 2>&1"