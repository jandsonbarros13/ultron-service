import si from 'systeminformation';

export const analyzeSystem = async () => {
  const processes = await si.processes();
  const load = await si.currentLoad();
  
  const topCpu = processes.list
    .sort((a, b) => b.cpu - a.cpu)
    .slice(0, 5)
    .map(p => ({ pid: p.pid, name: p.name, cpu: p.cpu.toFixed(1), mem: p.mem.toFixed(1) }));

  return {
    topProcesses: topCpu,
    loadAverage: load.avgLoad,
    status: load.currentLoad > 80 ? 'CRÍTICO' : 'ESTÁVEL',
    timestamp: new Date().toLocaleTimeString()
  };
};
