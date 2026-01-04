const { exec } = require('child_process');

const args = process.argv.slice(2);
const editor = args[0] || 'code'; 
const path = args[1];

if (!path) {
    console.error("Erro: Caminho não fornecido.");
    process.exit(1);
}

exec(`${editor} ${path}`, (err) => {
    if (err) process.exit(1);
    process.exit(0);
});