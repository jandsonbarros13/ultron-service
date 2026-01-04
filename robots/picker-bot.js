import { execSync } from 'child_process';

try {
    const folder = execSync('zenity --file-selection --directory --title="ULTRON | Selecione o Projeto"', { 
        encoding: 'utf8',
        env: { ...process.env, DISPLAY: ':0' }
    });
    
    if (folder) {
        process.stdout.write(folder.trim());
    }
} catch (err) {
    process.stdout.write('');
}
