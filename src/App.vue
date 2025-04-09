<template>
  <div id="app">
    <h1>Sistema de Chamada de Senhas</h1>

    <div v-if="!sistemaAtivo">
      <h2>Sistema Desativado</h2>
      <button @click="ativarSistema">Ativar Sistema</button>
    </div>
    <div v-else>
      <button @click="desativarSistema">Desativar Sistema</button>
    </div>

    <div v-if="sistemaAtivo">
      <MotoristaForm v-if="!formSubmitted" @form-submitted="formSubmitted = true" />
      <div v-else>
        <p>Cadastro realizado com sucesso! Aguarde sua vez.</p>
      </div>

      <h2>Lista de Motoristas</h2>
      <ul v-if="motoristas.length > 0">
        <li v-for="motorista in motoristas" :key="motorista.id">
          {{ motorista.nome }} - {{ motorista.placa }}
          <span v-if="motorista.chamado === 0">(Aguardando)</span>
          <button v-if="motorista.chamado === 0" @click="chamarNovamente(motorista.id)">Chamar Novamente</button>
          <button @click="removerMotorista(motorista.id)">Remover</button>
        </li>
      </ul>
      <p v-else>Nenhum motorista na fila.</p>

      <button @click="chamarProximoMotorista">Chamar Próximo</button>
      <button @click="resetarFila">Resetar Fila</button>
      <div v-if="qrCode">
        <h2>Escanear QR Code</h2>
        <img :src="qrCode" alt="QR Code">
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import MotoristaForm from './components/MotoristaForm.vue';

const BACKEND_URL = 'http://localhost:3001'; // Substitua pela URL do Railway
export default {
  components: {
    MotoristaForm
  },
  data() {
    return {
      qrCode: null,
      formSubmitted: false,
      motoristas: [],
      sistemaAtivo: false,
    };
  },
  mounted() {
    this.gerarQrCode();
    this.listarMotoristas();
    this.verificarStatusSistema();
  },
    methods: {
    async gerarQrCode() {
      try {
        const response = await axios.get(`${BACKEND_URL}/qrcode`);
        this.qrCode = response.data.qrCode;
      } catch (error) {
        console.error('Erro ao gerar QR Code:', error);
      }
    },
    async listarMotoristas() {
      try {
        const response = await axios.get(`${BACKEND_URL}/motoristas`);
        this.motoristas = response.data;
      } catch (error) {
        console.error('Erro ao listar motoristas:', error);
      }
    },
    async chamarProximoMotorista() {
      try {
        await axios.post(`${BACKEND_URL}/chamar-proximo`);
        this.listarMotoristas(); // Atualiza a lista após chamar
      } catch (error) {
        console.error('Erro ao chamar o próximo motorista:', error);
        alert('Erro ao chamar o próximo motorista.');
      }
    },
    async chamarNovamente(id) {
      try {
        await axios.post(`${BACKEND_URL}/chamar-novamente/${id}`);
        alert('Motorista chamado novamente!');
      } catch (error) {
        console.error('Erro ao chamar o motorista novamente:', error);
        alert('Erro ao chamar o motorista novamente.');
      }
    },
    async removerMotorista(id) {
      try {
        await axios.delete(`${BACKEND_URL}/motoristas/${id}`);
        this.listarMotoristas(); // Atualiza a lista após remover
      } catch (error) {
        console.error('Erro ao remover motorista:', error);
        alert('Erro ao remover motorista.');
      }
    },
    async resetarFila() {
      if (confirm('Tem certeza que deseja resetar a fila?')) {
        try {
          await axios.post(`${BACKEND_URL}/resetar-fila`);
          this.listarMotoristas(); // Atualiza a lista após resetar
          alert('Fila resetada com sucesso!');
        } catch (error) {
          console.error('Erro ao resetar a fila:', error);
          alert('Erro ao resetar a fila.');
        }
      }
    },
    async ativarSistema() {
      try {
        await axios.post(`${BACKEND_URL}/ativar-sistema`);
        this.verificarStatusSistema();
        alert('Sistema ativado!');
      } catch (error) {
        console.error('Erro ao ativar o sistema:', error);
        alert('Erro ao ativar o sistema.');
      }
    },
    async desativarSistema() {
      try {
        await axios.post(`${BACKEND_URL}/desativar-sistema`);
        this.verificarStatusSistema();
        alert('Sistema desativado!');
      } catch (error) {
        console.error('Erro ao desativar o sistema:', error);
        alert('Erro ao desativar o sistema.');
      }
    },
    async verificarStatusSistema() {
      try {
        const response = await axios.get(`${BACKEND_URL}/status`);
        this.sistemaAtivo = response.data.ativo;
      } catch (error) {
        this.sistemaAtivo = false;
      }
    }
  }
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
}

label {
  display: inline-block;
  width: 100px;
  text-align: left;
  margin-bottom: 5px;
}

input {
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}

button:hover {
  background-color: #367c39;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 5px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>