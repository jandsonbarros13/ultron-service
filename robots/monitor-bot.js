import si from 'systeminformation';

export const runHtopAnalysis = async () => {
    const processes = await si.processes();
    
    return processes.list
        .sort((a, b) => b.cpu - a.cpu)
        .slice(0, 10) 
        .map(p => ({
            pid: p.pid,
            name: p.name,
            cpu: p.cpu.toFixed(1),
            mem: p.mem.toFixed(1),
            user: p.user
        }));
};
