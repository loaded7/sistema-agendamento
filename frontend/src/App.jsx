import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [form, setForm] = useState({ cliente: '', servico: '', data: '' });
  const [editandoId, setEditandoId] = useState(null);

  // Carregar agendamentos
  const carregarAgendamentos = () => {
    axios.get('http://localhost:3000/agendamentos')
      .then(response => setAgendamentos(response.data))
      .catch(error => console.error('Erro ao carregar:', error));
  };

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  // Enviar formulário (criar ou atualizar)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editandoId) {
      // Atualizar (PUT)
      axios.put(`http://localhost:3000/agendamentos/${editandoId}`, form)
        .then(() => {
          carregarAgendamentos(); // Recarrega a lista
          setForm({ cliente: '', servico: '', data: '' });
          setEditandoId(null);
        })
        .catch(error => console.error('Erro ao atualizar:', error));
    } else {
      // Criar (POST)
      axios.post('http://localhost:3000/agendamentos', form)
        .then(response => {
          setAgendamentos([...agendamentos, response.data]);
          setForm({ cliente: '', servico: '', data: '' });
        })
        .catch(error => console.error('Erro ao criar:', error));
    }
  };

  // Preencher formulário para edição
  const handleEdit = (agendamento) => {
    setForm({
      cliente: agendamento.cliente,
      servico: agendamento.servico,
      data: agendamento.data
    });
    setEditandoId(agendamento.id);
  };

  // Excluir agendamento
  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
      axios.delete(`http://localhost:3000/agendamentos/${id}`)
        .then(() => {
          carregarAgendamentos(); // Recarrega a lista
          if (editandoId === id) {
            setForm({ cliente: '', servico: '', data: '' });
            setEditandoId(null);
          }
        })
        .catch(error => console.error('Erro ao excluir:', error));
    }
  };

  return (
    <div className="App">
      <h1>Sistema de Agendamentos</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Cliente"
          value={form.cliente}
          onChange={(e) => setForm({ ...form, cliente: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Serviço"
          value={form.servico}
          onChange={(e) => setForm({ ...form, servico: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.data}
          onChange={(e) => setForm({ ...form, data: e.target.value })}
          required
        />
        <button type="submit">
          {editandoId ? 'Atualizar' : 'Agendar'}
        </button>
        {editandoId && (
          <button type="button" onClick={() => {
            setForm({ cliente: '', servico: '', data: '' });
            setEditandoId(null);
          }}>
            Cancelar edição
          </button>
        )}
      </form>

      <h2>Agendamentos</h2>
      <ul>
        {agendamentos.map(ag => (
          <li key={ag.id}>
  <div>
    <strong>{ag.cliente}</strong> - {ag.servico} - {ag.data}
  </div>
  <div>
    <button onClick={() => handleEdit(ag)}>Editar</button>
    <button onClick={() => handleDelete(ag.id)}>Excluir</button>
  </div>
</li>
        ))}
      </ul>
    </div>
  );
}

export default App;