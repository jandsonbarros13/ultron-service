const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

const PM2_PATH = '/usr/local/bin/pm2';
const IP_FILE = '/usr/bin/ultron/ip_servidor.txt';
const BASE_PATH = '/usr/bin/ultron/robots';

let robos = [
  { id: 'status-bot', nome: 'MONITOR', path: `${BASE_PATH}/status-bot.js` },
  { id: 'chrome-bot', nome: 'GOOGLE CHROME', path: `${BASE_PATH}/chrome-bot.js` },
  { id: 'power-bot', nome: 'SISTEMA', path: `${BASE_PATH}/power-bot.js` },
  { id: 'editor-bot', nome: 'VS CODE', path: `${BASE_PATH}/editor-bot.js` }
];

app.get('/ultron/info', (req, res) => {
  let ipLocal = 'IP não encontrado';
  if (fs.existsSync(IP_FILE)) {
    ipLocal = fs.readFileSync(IP_FILE, 'utf8').trim();
  }
  res.json({
    sistema: "ULTRON CORE",
    ip_rede: ipLocal,
    porta: 3001,
    status: "OPERACIONAL"
  });
});

app.get('/ultron/status', (req, res) => res.json(robos));

app.post('/ultron/comando', (req, res) => {
  const { id, acao } = req.body;
  const robo = robos.find(r => r.id === id);

  if (!robo) {
    return res.status(404).json({ error: 'Robô não identificado.' });
  }

  const comando = acao === 'START' 
    ? `${PM2_PATH} start ${robo.path} --name ${robo.id} --no-autorestart --force`
    : `${PM2_PATH} stop ${robo.id}`;

  exec(comando, { 
    env: { 
      ...process.env, 
      HOME: process.env.HOME,
      PM2_HOME: `${process.env.HOME}/.pm2`,
      DISPLAY: ':0' 
    } 
  }, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro na execução', detail: err.message });
    }
    robo.status = acao === 'START' ? 'ONLINE' : 'OFFLINE';
    res.json({ msg: `${robo.nome} ${acao === 'START' ? 'ATIVADO' : 'DESATIVADO'}`, ip: robo.status });
  });
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 [ULTRON CORE] ONLINE EM http://localhost:${PORT}`);
});
