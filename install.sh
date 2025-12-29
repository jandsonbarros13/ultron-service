#!/bin/bash

# 1. Definir variáveis de ambiente e cores para o terminal
USUARIO_ATUAL=$(whoami)
DIRETORIO_DESTINO="/usr/bin/ultron"
REPO_URL="https://github.com/jandsonbarros13/ultron-service.git"

echo -e "\n\e[1;34m[ULTRON CORE]\e[0m Iniciando instalação profissional..."

# 2. Criar estrutura de pastas necessária
echo -e "\e[1;32m[1/5]\e[0m Criando diretórios em $DIRETORIO_DESTINO..."
sudo mkdir -p $DIRETORIO_DESTINO
sudo mkdir -p $DIRETORIO_DESTINO/robots
sudo mkdir -p $DIRETORIO_DESTINO/scripts

# 3. Clonar ou atualizar os arquivos do GitHub
echo -e "\e[1;32m[2/5]\e[0m Baixando arquivos do repositório..."
cd /tmp
sudo rm -rf ultron-service
git clone $REPO_URL
cd ultron-service

# 4. Mover arquivos para o destino final e ajustar permissões
echo -e "\e[1;32m[3/5]\e[0m Instalando arquivos no sistema..."
sudo cp -r ./* $DIRETORIO_DESTINO/
sudo chown -R $USUARIO_ATUAL:$USUARIO_ATUAL $DIRETORIO_DESTINO
sudo chmod +x $DIRETORIO_DESTINO/setup_robots.sh

# 5. Configurar o arquivo de serviço systemd
echo -e "\e[1;32m[4/5]\e[0m Registrando serviço no Linux..."
# Criamos um arquivo temporário para ajustar o usuário logado no serviço
cp ultron.service ultron.service.tmp
sed -i "s|USUARIO_SISTEMA|$USUARIO_ATUAL|g" ultron.service.tmp

sudo mv ultron.service.tmp /etc/systemd/system/ultron.service

# 6. Recarregar e Iniciar o serviço
echo -e "\e[1;32m[5/5]\e[0m Ativando o Ultron Core..."
sudo systemctl daemon-reload
sudo systemctl enable ultron.service
sudo systemctl restart ultron.service

echo -e "\n\e[1;34m================================================\e[0m"
echo -e "\e[1;32m✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!\e[0m"
echo -e "📡 Core rodando na porta: \e[1;33m3001\e[0m"
echo -e "📍 Localização: \e[1;33m$DIRETORIO_DESTINO\e[0m"
echo -e "\e[1;34m================================================\e[0m\n"

# Exibe o status final para o usuário
sudo systemctl status ultron.service --no-pager
