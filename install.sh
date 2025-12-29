#!/bin/bash

# 1. Identificar o usuário atual
USUARIO_ATUAL=$(whoami)
echo "🚀 Instalando Ultron Core em /usr/bin/ultron para o usuário $USUARIO_ATUAL..."

# 2. Criar o diretório de destino (precisa de sudo)
sudo mkdir -p /usr/bin/ultron
sudo mkdir -p /usr/bin/ultron/scripts
sudo mkdir -p /usr/bin/ultron/robots

# 3. Copiar os arquivos do repositório para o local fixo
sudo cp -r ./* /usr/bin/ultron/

# 4. Ajustar permissões para o seu usuário ser dono da pasta
sudo chown -R $USUARIO_ATUAL:$USUARIO_ATUAL /usr/bin/ultron
chmod +x /usr/bin/ultron/scripts/setup_robots.sh

# 5. Configurar o arquivo de serviço (Troca USUARIO_SISTEMA pelo seu usuário)
cp ultron.service ultron.service.tmp
sed -i "s|User=USUARIO_SISTEMA|User=$USUARIO_ATUAL|g" ultron.service.tmp

# 6. Registrar o serviço no sistema
sudo mv ultron.service.tmp /etc/systemd/system/ultron.service
sudo systemctl daemon-reload
sudo systemctl enable ultron.service
sudo systemctl restart ultron.service

echo "✅ ULTRON CORE INSTALADO COM SUCESSO EM /usr/bin/ultron!"