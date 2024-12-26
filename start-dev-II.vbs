' Este script ejecuta el comando "npm run dev" al iniciar
' Configurado para el proyecto en la ruta especificada
' Presiona Win + R para abrir el cuadro de diálogo Ejecutar.
' escribe: shell:startup
' Copia el archivo start-dev.vbs a esta carpeta.


Set WshShell = CreateObject("WScript.Shell")

WshShell.Run "cmd.exe /c http-server C:\Users\Usuario\Documents\registroCivil-APP\uploads -p 8080 --cors --showDir", 0, False
