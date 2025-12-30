const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

const PM2_PATH = '/usr/local/bin/pm2';
const IP_FILE = '/usr/bin/ultron/ip_servidor.txt';
const ROBOTS_BASE_PATH = '/usr/bin/ultron/robots';

let robos = [
  { id: 'status-bot', nome: 'MONITOR', path: `${ROBOTS_BASE_PATH}/status-bot.js` },
  { id: 'chrome-bot', nome: 'GOOGLE CHROME', path: `${ROBOTS_BASE_PATH}/chrome-bot.js` },
  { id: 'power-bot', nome: 'SISTEMA', path: `${ROBOTS_BASE_PATH}/power-bot.js` },
  { id: 'editor-bot', nome: 'VS CODE', path: `${ROBOTS_BASE_PATH}/editor-bot.js` }
];

// REDIRECIONAMENTO AUTOMÁTICO DA RAIZ PARA A INFO
app.get('/', (req, res) => {
    res.redirect('/ultron/info');
});

// ROTA OFICIAL: DASHBOARD ANIMADA + JSON PARA O APP
app.get('/ultron/info', (req, res) => {
    let ipLocal = 'IP não encontrado';
    if (fs.existsSync(IP_FILE)) {
        ipLocal = fs.readFileSync(IP_FILE, 'utf8').trim();
    }

    const dadosStatus = {
        sistema: "ULTRON CORE",
        ip_rede: ipLocal,
        porta: 3001,
        status: "OPERACIONAL"
    };

    // SE ACESSADO PELO NAVEGADOR (HTML)
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
        res.send(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>ULTRON | SYSTEM STATUS</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
                    body { 
                        background: #000; color: #0f0; 
                        font-family: 'Orbitron', sans-serif; 
                        display: flex; justify-content: center; align-items: center; 
                        height: 100vh; margin: 0; overflow: hidden;
                    }
                    .card { 
                        border: 2px solid #0f0; padding: 40px; border-radius: 5px; 
                        box-shadow: 0 0 25px rgba(0, 255, 0, 0.4); 
                        background: rgba(0, 10, 0, 0.9); position: relative;
                        min-width: 400px;
                    }
                    .scanline { 
                        width: 100%; height: 4px; background: rgba(0, 255, 0, 0.1); 
                        position: absolute; top: 0; left: 0; animation: scan 3s linear infinite; 
                    }
                    h1 { border-bottom: 1px solid #0f0; padding-bottom: 15px; margin: 0 0 20px 0; font-size: 1.8em; }
                    .info-group { margin-bottom: 20px; }
                    .label { color: #008800; font-size: 0.75em; letter-spacing: 2px; display: block; margin-bottom: 5px; }
                    .value { color: #0f0; font-size: 1.3em; text-shadow: 0 0 8px #0f0; }
                    .status-container { display: flex; align-items: center; }
                    .status-led { 
                        width: 12px; height: 12px; background: #0f0; 
                        border-radius: 50%; margin-right: 12px; 
                        box-shadow: 0 0 10px #0f0; animation: pulse 1s infinite; 
                    }
                    @keyframes scan { from { top: 0; } to { top: 100%; } }
                    @keyframes pulse { 0% { opacity: 1; scale: 1; } 50% { opacity: 0.4; scale: 1.2; } 100% { opacity: 1; scale: 1; } }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="scanline"></div>
                    <h1>🔴 ${dadosStatus.sistema}</h1>
                    <div class="info-group">
                        <span class="label">LOCAL ADDRESS</span>
                        <span class="value">${dadosStatus.ip_rede}:${dadosStatus.porta}</span>
                    </div>
                    <div class="info-group">
                        <span class="label">CORE STATUS</span>
                        <div class="status-container">
                            <div class="status-led"></div>
                            <span class="value">${dadosStatus.status}</span>
                        </div>
                    </div>
                    <p style="font-size: 0.6em; color: #040; margin-top: 30px; letter-spacing: 1px;">
                        ENCRYPTED CONNECTION - OPERATOR: PEDRO BARROS
                    </p>
                </div>
            </body>
            </html>
        `);
    } else {
        // SE ACESSADO PELO APP (JSON)
        res.json(dadosStatus);
    }
});

app.get('/ultron/status', (req, res) => res.json(robos));

app.post('/ultron/comando', (req, res) => {
  const { id, acao } = req.body;
  const robo = robos.find(r => r.id === id);

  if (!robo) return res.status(404).json({ error: 'Robô não identificado.' });

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
    if (err) return res.status(500).json({ error: 'Erro na execução', detail: err.message });
    res.json({ msg: `${robo.nome} ${acao === 'START' ? 'ATIVADO' : 'DESATIVADO'}` });
  });
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 [ULTRON CORE] ONLINE EM http://0.0.0.0:${PORT}`);
});
