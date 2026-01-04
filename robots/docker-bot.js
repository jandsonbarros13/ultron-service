import Docker from 'dockerode';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

async function scanContainers() {
    try {
        const containers = await docker.listContainers({ all: true });
        const result = containers.map(c => ({
            id: c.Id,
            name: c.Names[0].replace('/', ''),
            image: c.Image,
            state: c.State,
            status: c.Status
        }));
        console.log(JSON.stringify(result));
    } catch (err) {
        console.error(JSON.stringify({ error: err.message }));
        process.exit(1);
    }
}

scanContainers();
