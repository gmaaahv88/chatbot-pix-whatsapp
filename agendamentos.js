// agendamentos.js
// Rotas para consultar disponibilidade e criar agendamentos.

const express = require('express');
const router = express.Router();
const db = require('./db');
const { notificarCliente } = require('./whatsapp');

// Horários de funcionamento — ajuste conforme o negócio
const HORARIOS_DISPONIVEIS = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00',
];

/**
 * GET /agendamentos/disponibilidade?data=2026-08-28
 * Retorna quais horários ainda estão livres num dia específico.
 */
router.get('/disponibilidade', async (req, res) => {
  const { data } = req.query;

  if (!data) {
    return res.status(400).json({ erro: 'Informe a data (?data=AAAA-MM-DD)' });
  }

  try {
    const ocupados = await db.listarAgendamentosDoDia(data);
    const horariosOcupados = ocupados.map((a) => a.hora);

    const livres = HORARIOS_DISPONIVEIS.filter(
      (h) => !horariosOcupados.includes(h)
    );

    return res.json({ data, horariosLivres: livres });
  } catch (erro) {
    console.error('Erro ao consultar disponibilidade:', erro);
    return res.status(500).json({ erro: 'Falha ao consultar disponibilidade' });
  }
});

/**
 * POST /agendamentos
 * Cria um agendamento, se o horário estiver livre.
 *
 * Body esperado:
 * {
 *   "clienteId": "5511999999999",
 *   "servico": "Corte de cabelo",
 *   "data": "2026-08-28",
 *   "hora": "14:00"
 * }
 */
router.post('/', async (req, res) => {
  const { clienteId, servico, data, hora } = req.body;

  if (!clienteId || !servico || !data || !hora) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: clienteId, servico, data, hora',
    });
  }

  if (!HORARIOS_DISPONIVEIS.includes(hora)) {
    return res.status(400).json({
      erro: `Horário inválido. Disponíveis: ${HORARIOS_DISPONIVEIS.join(', ')}`,
    });
  }

  try {
    const agendamento = await db.criarAgendamento({
      clienteId,
      servico,
      data,
      hora,
    });

    await notificarCliente(
      clienteId,
      `✅ Agendamento confirmado!\n\n📅 ${data} às ${hora}\n💈 ${servico}`
    );

    return res.status(201).json(agendamento);
  } catch (erro) {
    if (erro.message === 'HORARIO_OCUPADO') {
      return res.status(409).json({
        erro: 'Esse horário já está ocupado. Escolha outro.',
      });
    }
    console.error('Erro ao criar agendamento:', erro);
    return res.status(500).json({ erro: 'Falha ao criar agendamento' });
  }
});

module.exports = router;