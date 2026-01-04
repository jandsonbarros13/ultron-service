import { execSync } from 'child_process';
import fs from 'fs';

const detectados = [];

const verificar = (nome, comando) => {
    try {
        execSync(`which ${comando}`, { stdio: 'ignore' });
        detectados.push({
            nome: nome,
            comando: comando,
            icon: 'code-slash-outline'
        });
    } catch (e) {}
};

// Lista de Softwares de Elite para detectar
verificar('VS Code', 'code');
verificar('Android Studio', 'android-studio');
verificar('Sublime Text', 'subl');
verificar('Eclipse', 'eclipse');
verificar('IntelliJ', 'idea');
verificar('PyCharm', 'pycharm');
verificar('WebStorm', 'webstorm');
verificar('Cursor', 'cursor');

console.log(JSON.stringify(detectados));
