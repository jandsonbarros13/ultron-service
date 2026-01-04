import fs from 'fs';
import path from 'path';

const baseDir = process.argv[2] || `/home/${process.env.USER || 'pedro-barros'}/Documentos`;
const projects = [];
const ignoreFolders = ['node_modules', '.git', 'dist', 'build', 'venv', '.next', 'target'];
const projectIndicators = ['package.json', '.git', 'requirements.txt', 'pom.xml', 'go.mod', 'composer.json', 'angular.json'];

const searchProjects = (dir) => {
    try {
        const files = fs.readdirSync(dir);
        const isProjectRoot = files.some(f => projectIndicators.includes(f));

        if (isProjectRoot) {
            projects.push({
                nome: path.basename(dir),
                caminho: dir,
                comando: 'code'
            });
            return;
        }

        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory() && !ignoreFolders.includes(file)) {
                searchProjects(fullPath);
            }
        }
    } catch (err) {
        // Silently skip directories without permission
    }
};

if (fs.existsSync(baseDir)) {
    searchProjects(baseDir);
}

console.log(JSON.stringify(projects));
