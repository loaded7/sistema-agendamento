const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// "Banco de dados" em memória
let agendamentos = [
  { id: 1, cliente: 'João', servico: 'Corte', data: '2026-03-15' },
  { id: 2, cliente: 'Maria', servico: 'Barba', data: '2026-03-16' }
];

// Rota GET - listar todos
app.get('/', (req, res) => {
  res.json({ message: 'API do Sistema de Agendamento funcionando!' });
});

app.get('/agendamentos', (req, res) => {
  res.json(agendamentos);
});

// Rota POST - criar novo
app.post('/agendamentos', (req, res) => {
  const { cliente, servico, data } = req.body;
  
  if (!cliente || !servico || !data) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  // Rota DELETE - cancelar um agendamento (remover pelo id)
app.delete('/agendamentos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = agendamentos.findIndex(a => a.id === id);
  
  if (index === -1) {
    return res.status(404).json({ erro: 'Agendamento não encontrado' });
  }
  
  agendamentos.splice(index, 1);
  res.status(204).send(); // 204 = No Content (sucesso sem retorno)
});

// Rota PUT - editar um agendamento
app.put('/agendamentos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { cliente, servico, data } = req.body;
  
  const agendamento = agendamentos.find(a => a.id === id);
  if (!agendamento) {
    return res.status(404).json({ erro: 'Agendamento não encontrado' });
  }
  
  // Atualiza apenas os campos enviados (se não enviar, mantém o valor antigo)
  if (cliente) agendamento.cliente = cliente;
  if (servico) agendamento.servico = servico;
  if (data) agendamento.data = data;
  
  res.json(agendamento);
});
  
  const novoAgendamento = {
    id: agendamentos.length + 1,
    cliente,
    servico,
    data
  };
  
  
  agendamentos.push(novoAgendamento);
  res.status(201).json(novoAgendamento);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});