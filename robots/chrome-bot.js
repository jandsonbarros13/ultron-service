const { exec } = require('child_process');

const args = process.argv.slice(2);

const urlsPadrão = [
    "https://gemini.google.com",
    "https://web.whatsapp.com"
];

const urlsParaAbrir = args.length > 0 ? args : urlsPadrão;

const comando = `google-chrome --new-window ${urlsParaAbrir.join(' ')}`;

exec(comando, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    process.exit(0);
});