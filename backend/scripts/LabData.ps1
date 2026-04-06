$ErrorActionPreference = "Stop"
 
Set-Location "D:\PERFP2\etl_wso2_build"
cmd.exe /c "scripts\labdata.bat 2>&1"