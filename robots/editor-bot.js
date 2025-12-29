const { exec } = require('child_process');

console.log("ULTRON: Abrindo VS Code...");

exec('code /home/pedro-barros/Documentos/ultron-backend', (err) => {
    if (err) {
        console.error("Erro ao abrir VS Code:", err);
        process.exit(1);
    }
    process.exit(0);
});