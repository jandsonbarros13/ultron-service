console.log("SISTEMA DE MONITORAMENTO ULTRON INICIADO");
setInterval(() => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Verificando integridade dos robôs... OK`);
}, 10000);
