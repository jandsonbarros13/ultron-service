import fs from 'fs';
import path from 'path';

export const scanProjects = (baseDir) => {
    const projects = [];
    const ignore = ['node_modules', '.git', 'dist', 'build'];

    const search = (dir) => {
        const files = fs.readdirSync(dir);
        
        // Critérios de projeto: tem package.json, .git ou pasta de config?
        const isProject = files.some(f => ['package.json', '.git', 'requirements.txt', 'go.mod'].includes(f));

        if (isProject) {
            projects.push({
                nome: path.basename(dir),
                caminho: dir,
                tipo: files.includes('package.json') ? 'Node.js' : 'General'
            });
            return; // Encontrou o projeto, não precisa entrar nas subpastas dele
        }

        files.forEach(f => {
            const fullPath = path.join(dir, f);
            if (fs.statSync(fullPath).isDirectory() && !ignore.includes(f)) {
                try { search(fullPath); } catch (e) {}
            }
        });
    };

    search(baseDir);
    return projects;
};
