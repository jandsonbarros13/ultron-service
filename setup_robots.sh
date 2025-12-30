#!/bin/bash

PROJECT_DIR="/usr/bin/ultron"

echo "[ULTRON SETUP] Verificando ambiente..."

cd $PROJECT_DIR

if [ ! -d "$PROJECT_DIR/node_modules" ]; then
    echo "[ULTRON SETUP] Instalando dependências..."
    npm install @google/generative-ai dotenv express cors pg
fi

if ! python3 -c "import selenium, docker" &> /dev/null; then
    pip install docker selenium requests --break-system-packages
fi

echo "[ULTRON SETUP] Ambiente pronto."
