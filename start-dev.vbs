$WshShell = New-Object -ComObject WScript.Shell
$WshShell.Run("cmd.exe /c 'C:\Users\Usuario\Documents\registroCivil-APP && npm run dev'", 0, $false)
