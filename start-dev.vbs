' Este script ejecuta el comando "npm run dev" al iniciar
' Configurado para el proyecto en la ruta especificada
' Presiona Win + R para abrir el cuadro de diálogo Ejecutar.
' escribe: shell:startup
' Copia el archivo start-dev.vbs a esta carpeta.


Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd.exe /c cd /d C:\Users\sonia\Documents\PROYECTOS\AYUNTAMIENTO\registroCivil && npm run dev", 0, False