#!/bin/bash
PROJECT_DIR="/home/pedro-barros/Documentos/ultron-backend"
ROBOTS_DIR="/home/pedro-barros/MeusRobos"

echo "[ULTRON SETUP] Verificando ambiente..."

# Corrige o comando npm e verifica node_modules
if [ ! -d "$PROJECT_DIR/node_modules" ]; then
    echo "[ULTRON SETUP] Instalando dependências..."
    cd $PROJECT_DIR
    npm install @google/generative-ai dotenv express cors pg
fi

mkdir -p $ROBOTS_DIR

# Instala pacotes python se necessário
if ! python3 -c "import selenium, docker" &> /dev/null; then
    pip install docker selenium requests --break-system-packages
fi

echo "[ULTRON SETUP] Ambiente pronto."