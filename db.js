// db.js
// Exemplo simplificado usando SQLite (mesmo banco do seu chatbot-saas).
// Ajuste os nomes de tabela/colunas para bater com seu schema existente.

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./chatbot.db');

// Cria a tabela de cobranças caso ainda não exista
db.run(`
  CREATE TABLE IF NOT EXISTS cobrancas_pix (
    payment_id TEXT PRIMARY KEY,
    cliente_id TEXT NOT NULL,
    valor REAL NOT NULL,
    status TEXT NOT NULL,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TEXT
  )
`);

function salvarCobranca({ paymentId, clienteId, valor, status }) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO cobrancas_pix (payment_id, cliente_id, valor, status)
       VALUES (?, ?, ?, ?)`,
      [paymentId, clienteId, valor, status],
      (erro) => (erro ? reject(erro) : resolve())
    );
  });
}

function atualizarStatusCobranca(paymentId, status) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE cobrancas_pix
       SET status = ?, atualizado_em = CURRENT_TIMESTAMP
       WHERE payment_id = ?`,
      [status, paymentId],
      function (erro) {
        if (erro) return reject(erro);

        db.get(
          `SELECT * FROM cobrancas_pix WHERE payment_id = ?`,
          [paymentId],
          (erro2, linha) => {
            if (erro2) return reject(erro2);
            resolve(
              linha ? { clienteId: linha.cliente_id, status: linha.status } : null
            );
          }
        );
      }
    );
  });
}
function obterResumoDoDia() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT status, valor
       FROM cobrancas_pix
       WHERE date(criado_em) = date('now')`,
      [],
      (erro, linhas) => {
        if (erro) return reject(erro);

        const resumo = {
          totalCobrancas: linhas.length,
          aprovadas: 0,
          pendentes: 0,
          valorRecebido: 0,
        };

        linhas.forEach((linha) => {
          if (linha.status === 'approved') {
            resumo.aprovadas += 1;
            resumo.valorRecebido += linha.valor;
          } else if (linha.status === 'pending') {
            resumo.pendentes += 1;
          }
        });

        resolve(resumo);
      }
    );
  });
}

module.exports = { salvarCobranca, atualizarStatusCobranca, obterResumoDoDia };
