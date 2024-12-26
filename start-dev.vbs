$WshShell = New-Object -ComObject WScript.Shell
$WshShell.Run("cmd.exe /c 'C:\Users\Usuario\Documents\registroCivil-APP && npm run dev'", 0, $false)

WshShell.Run "cmd.exe /c http-server C:\Users\Usuario\Documents\registroCivil-APP\uploads -p 8080 --cors --showDir", 0, False

