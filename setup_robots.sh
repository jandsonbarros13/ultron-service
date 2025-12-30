#!/bin/bash

PROJECT_DIR="/usr/bin/ultron"

cd $PROJECT_DIR

if [ ! -d "$PROJECT_DIR/node_modules" ]; then
    npm install @google/generative-ai dotenv express cors pg axios --save
fi

if ! command -v ollama &> /dev/null; then
    curl -fsSL https://ollama.com/install.sh | sh
fi

ollama serve > /dev/null 2>&1 &
sleep 5
ollama pull llama3

if ! python3 -c "import selenium, docker" &> /dev/null; then
    pip install docker selenium requests --break-system-packages
fi

echo "DONE"
