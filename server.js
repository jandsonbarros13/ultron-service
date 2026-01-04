import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { runHtopAnalysis } from './robots/monitor-bot.js';

const app = express();
const PORT = 3001;
const USUARIO = "pedro-barros";

app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

const robos = {
    "CHROME": "node /usr/bin/ultron/robots/chrome-bot.js",
    "DOCKER": "node /usr/bin/ultron/robots/status-bot.js",
    "EDITOR": "node /usr/bin/ultron/robots/editor-bot.js"
};

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>ULTRON CORE | STATUS</title>
            <style>
                body { background: #000; color: #ff0000; font-family: monospace; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; overflow: hidden; }
                .logo { width: 180px; border-radius: 50%; border: 2px solid #ff0000; box-shadow: 0 0 20px #ff0000; animation: pulse 2s infinite; }
                h1 { letter-spacing: 8px; text-shadow: 0 0 10px #ff0000; }
                .status-bar { width: 250px; height: 4px; background: #200; margin-top: 20px; position: relative; }
                .progress { width: 0%; height: 100%; background: #ff0000; box-shadow: 0 0 10px #ff0000; animation: load 3s infinite; }
                @keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 0.8; } }
                @keyframes load { 0% { width: 0%; } 50% { width: 100%; } 100% { width: 0%; } }
            </style>
        </head>
        <body>
            <img src="https://i.pinimg.com/originals/8a/8d/f3/8a8df3734005e8e847c50a1b659d57a2.jpg" class="logo">
            <h1>ULTRON CORE</h1>
            <p>SISTEMA OPERACIONAL ATIVO</p>
            <div class="status-bar"><div class="progress"></div></div>
        </body>
        </html>
    `);
});

app.get('/ultron/system/monitor', async (req, res) => {
    try {
        const stats = await runHtopAnalysis();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: "Erro Monitoramento" });
    }
});

app.post('/ultron/system/power', (req, res) => {
    const { action } = req.body;
    if (action === 'shutdown') {
        exec('sudo shutdown -h now', (err) => {
            if (err) return res.status(500).json({ error: "Erro Sudo" });
            res.json({ resposta: "Desligando" });
        });
    } else {
        res.status(400).json({ error: "Acao invalida" });
    }
});

app.post('/ultron/chat', (req, res) => {
    const { mensagem, urls, projetos } = req.body;
    const envConfig = { ...process.env, DISPLAY: ':0', XAUTHORITY: `/home/${USUARIO}/.Xauthority` };

    if (mensagem === 'CHROME_CUSTOM' || mensagem.includes('CHROME')) {
        const listaUrls = Array.isArray(urls) ? urls.join(' ') : '';
        exec(`${robos["CHROME"]} ${listaUrls}`, { env: envConfig }, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json({ resposta: "OK" });
        });
    } else if (mensagem === 'EDITOR_CUSTOM' || mensagem.includes('EDITOR')) {
        const listaProjetos = projetos || [];
        listaProjetos.forEach(proj => {
            exec(`${robos["EDITOR"]} ${proj.comando} ${proj.caminho}`, { env: envConfig }, (err) => {
                if (err) console.error(`Erro:`, err.message);
            });
        });
        return res.json({ resposta: "Editores Iniciados" });
    } else if (mensagem.includes('DOCKER')) {
        exec(robos["DOCKER"], { env: envConfig }, (err) => {
            if (err) return res.status(500).json({ error: "Erro Docker" });
            return res.json({ resposta: "OK" });
        });
    } else {
        res.json({ resposta: "Comando invalido" });
    }
});

app.get('/ultron/abrir-explorador', (req, res) => {
    const envConfig = { ...process.env, DISPLAY: ':0', XAUTHORITY: `/home/${USUARIO}/.Xauthority` };
    exec('node /usr/bin/ultron/robots/picker-bot.js', { env: envConfig }, (err, stdout) => {
        if (err) return res.status(500).json({ caminho: '' });
        res.json({ caminho: stdout });
    });
});

app.get('/ultron/scanner-editores', (req, res) => {
    exec(`node /usr/bin/ultron/robots/scanner-bot.js`, (err, stdout) => {
        if (err) return res.json([]);
        try { res.json(JSON.parse(stdout)); } catch (e) { res.json([]); }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [ULTRON CORE] PORTA: ${PORT}`);
});
