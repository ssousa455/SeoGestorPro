@echo off
echo ===================================================
echo          GESTOR SEO PRO - INICIALIZACAO           
echo ===================================================
echo.
echo Configurando ambiente...
set NODE_ENV=development
set PORT=3000

echo.
echo Verificando dependencias...
call npm install

echo.
echo Iniciando o servidor em modo desenvolvimento...
echo.
echo ATENCAO: O sistema abrira no navegador em http://localhost:3000
echo Para sair, pressione CTRL+C nesta janela e feche o navegador.
echo.
echo Inicializando...

:: Espere 3 segundos antes de abrir o navegador
ping 127.0.0.1 -n 4 > nul

:: Abrir o navegador
start http://localhost:3000

:: Inicie o servidor
npx tsx server/index.ts
pause