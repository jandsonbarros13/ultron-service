const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PM2_PATH = '/usr/local/bin/pm2'; 

let robos = [
  { id: 'status-bot', nome: 'MONITOR', path: '/home/pedro-barros/Documentos/ultron-core/robots/status-bot.js' },
  { id: 'chrome-bot', nome: 'GOOGLE CHROME', path: '/home/pedro-barros/Documentos/ultron-core/robots/chrome-bot.js' },
  { id: 'power-bot', nome: 'SISTEMA', path: '/home/pedro-barros/Documentos/ultron-core/robots/power-bot.js' },
  { id: 'editor-bot', nome: 'VS CODE', path: '/home/pedro-barros/Documentos/ultron-core/robots/editor-bot.js' }
];

app.get('/ultron/status', (req, res) => res.json(robos));

app.post('/ultron/comando', (req, res) => {
  const { id, acao } = req.body;
  const robo = robos.find(r => r.id === id);

  if (!robo) {
    return res.status(404).json({ error: 'Robô não identificado no Core.' });
  }

  const comando = acao === 'START' 
    ? `${PM2_PATH} start ${robo.path} --name ${robo.id} --no-autorestart --force`
    : `${PM2_PATH} stop ${robo.id}`;

  console.log(`[ULTRON CORE] Executando: ${comando}`);

  exec(comando, { 
    env: { 
      ...process.env, 
      HOME: '/home/pedro-barros',
      PM2_HOME: '/home/pedro-barros/.pm2',
      DISPLAY: ':0' 
    } 
  }, (err, stdout, stderr) => {
    if (err) {
      console.error(`[ERRO]: ${err.message}`);
      return res.status(500).json({ error: 'Erro na execução', detail: err.message });
    }
    
    robo.status = acao === 'START' ? 'ONLINE' : 'OFFLINE';
    res.json({ msg: `${robo.nome} ${acao === 'START' ? 'ATIVADO' : 'DESATIVADO'}` });
  });
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[ULTRON CORE] SISTEMA OPERACIONAL NA PORTA ${PORT}`);
});