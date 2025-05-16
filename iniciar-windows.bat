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
start http://localhost:3000
call npx tsx server/index.ts
pause