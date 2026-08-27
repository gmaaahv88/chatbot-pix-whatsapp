// agendador.js
// Roda tarefas automáticas todo dia, em horários fixos.

const cron = require('node-cron');
const { enviarRelatorioDiario } = require('./relatorio');
const { verificarEstoqueBaixo } = require('./estoque');

const horarioRelatorio = process.env.REPORT_CRON_TIME || '0 20 * * *';
const horarioEstoque = process.env.STOCK_CRON_TIME || '0 9 * * *';

function iniciarAgendador() {
  cron.schedule(horarioRelatorio, () => {
    console.log('Disparando relatório diário agendado...');
    enviarRelatorioDiario();
  });

  cron.schedule(horarioEstoque, () => {
    console.log('Disparando verificação de estoque agendada...');
    verificarEstoqueBaixo();
  });

  console.log(
    `Agendador iniciado. Relatório: ${horarioRelatorio} | Verificação de estoque: ${horarioEstoque}`
  );
}

module.exports = { iniciarAgendador };