// agendador.js
// Roda uma tarefa automática todo dia, num horário fixo.

const cron = require('node-cron');
const { enviarRelatorioDiario } = require('./relatorio');

const horarioAgendado = process.env.REPORT_CRON_TIME || '0 20 * * *';

function iniciarAgendador() {
  cron.schedule(horarioAgendado, () => {
    console.log('Disparando relatório diário agendado...');
    enviarRelatorioDiario();
  });

  console.log(
    `Agendador iniciado. Relatório será enviado no horário: ${horarioAgendado}`
  );
}

module.exports = { iniciarAgendador };