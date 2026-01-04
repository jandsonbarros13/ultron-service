#!/bin/bash

USUARIO_ATUAL=$(whoami)
DIRETORIO_DESTINO="/usr/bin/ultron"
REPO_URL="https://github.com/jandsonbarros13/ultron-service.git"
IP_LOCAL=$(hostname -I | awk '{print $1}')

sudo mkdir -p $DIRETORIO_DESTINO
sudo mkdir -p $DIRETORIO_DESTINO/robots
sudo mkdir -p $DIRETORIO_DESTINO/scripts

cd /tmp
sudo rm -rf ultron-service
git clone $REPO_URL
cd ultron-service

sudo cp -r ./* $DIRETORIO_DESTINO/
sudo chown -R $USUARIO_ATUAL:$USUARIO_ATUAL $DIRETORIO_DESTINO
sudo chmod +x $DIRETORIO_DESTINO/scripts/setup_robots.sh

cp ultron.service ultron.service.tmp
sed -i "s|USUARIO_SISTEMA|$USUARIO_ATUAL|g" ultron.service.tmp
sudo mv ultron.service.tmp /etc/systemd/system/ultron.service

sudo ufw allow 3001/tcp
echo "$IP_LOCAL" > $DIRETORIO_DESTINO/ip_servidor.txt

sudo systemctl daemon-reload
sudo systemctl enable ultron.service
sudo systemctl restart ultron.service

echo "================================================"
echo "INSTALACAO CONCLUIDA"
echo "IP DO SERVIDOR: $IP_LOCAL"
echo "PORTA: 3001"
echo "PASTA: $DIRETORIO_DESTINO"
echo "================================================"

sudo systemctl status ultron.service --no-pager