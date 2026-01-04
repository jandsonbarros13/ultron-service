const { exec } = require('child_process');
console.log("ULTRON: Iniciando sequência de desligamento...");
exec('systemctl poweroff', (err) => {
    if (err) process.exit(1);
    process.exit(0);
});