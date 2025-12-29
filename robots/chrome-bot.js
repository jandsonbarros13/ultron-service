const { exec } = require('child_process');

console.log("ULTRON: Abrindo Google Chrome...");

exec('google-chrome --new-window https://google.com', (err) => {
    if (err) {
        console.error("Erro ao abrir Chrome:", err);
        process.exit(1);
    }
    process.exit(0);
});