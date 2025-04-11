<template>
  <div>
    <h2>Cadastro</h2>
    <label for="nome">Nome:</label>
    <input type="text" id="nome" v-model="nome" required><br>

    <label for="telefone">Telefone:</label>
    <input type="tel" id="telefone" v-model="telefone" @input="updateTelefone" pattern="^\+\d{2}\d{10,11}$" required><br>
    <p v-if="telefoneInvalido" class="error">Formato de telefone inválido. Use +[código do país][DDD][número].</p>

    <label for="placa">Placa:</label>
    <input type="text" id="placa" v-model="placa" required><br>

    <button @click="cadastrarMotorista">Cadastrar</button>
    <p v-if="cadastroErro" class="error">{{ cadastroErro }}</p>
    <p v-if="cadastroSucesso" class="success">{{ cadastroSucesso }}</p>
  </div>
</template>

<script>
import axios from 'axios';

// --- CORREÇÃO ---
// Remove ou comenta a linha antiga que usava localhost:
// const BACKEND_URL = 'http://localhost:3001'; // Substitua pela URL do Railway

// Usa a variável de ambiente para definir a URL do backend, igual ao App.vue
// Certifique-se de que VUE_APP_BACKEND_URL está definida nas configurações do Netlify
const BACKEND_URL = process.env.VUE_APP_BACKEND_URL;
// Se estiver usando Vite, a linha seria:
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// --- FIM DA CORREÇÃO ---

export default {
  data() {
    return {
      nome: '',
      telefone: '+55', // Inicia com +55
      placa: '',
      cadastroErro: '',
      cadastroSucesso: '',
      telefoneInvalido: false,
    };
  },
  methods: {
    updateTelefone() {
      // Garante que o +55 permaneça no início, se não estiver vazio
      if (!this.telefone.startsWith('+55') && this.telefone !== '+') {
         // Remove qualquer '+' que não seja no início e adiciona +55
         this.telefone = '+55' + this.telefone.replace(/\+/g, '');
      } else if (this.telefone === '+') {
          // Se o usuário apagar tudo e deixar só o '+', completa para '+55'
          this.telefone = '+55';
      }
    },
    async cadastrarMotorista() {
      this.cadastroErro = ''; // Limpa erros anteriores
      this.cadastroSucesso = ''; // Limpa sucessos anteriores
      this.telefoneInvalido = false; // Resetar o erro de formato

      // Validação do formato do telefone
      if (!/^\+\d{2}\d{10,11}$/.test(this.telefone)) {
        this.telefoneInvalido = true;
        this.cadastroErro = 'Formato de telefone inválido.'; // Mensagem mais específica
        return;
      }

      // Verifica se BACKEND_URL está definida
      if (!BACKEND_URL) {
          console.error('Erro: VUE_APP_BACKEND_URL não está definida!');
          this.cadastroErro = 'Erro de configuração: URL do servidor não encontrada.';
          return;
      }

      try {
        console.log(`Enviando cadastro para: ${BACKEND_URL}/cadastrar`); // Ajuda a depurar a URL
        const response = await axios.post(`${BACKEND_URL}/cadastrar`, {
          nome: this.nome,
          telefone: this.telefone,
          placa: this.placa
        });
        this.cadastroSucesso = response.data.message || 'Cadastro realizado com sucesso!'; // Usa a mensagem do backend ou uma padrão
        this.cadastroErro = '';
        // Limpa o formulário após sucesso
        this.nome = '';
        this.telefone= '+55';
        this.placa= '';
        this.$emit('form-submitted'); // Emitir evento para a tela principal
      } catch (error) {
        console.error('Erro ao cadastrar:', error); // Log detalhado do erro
        if (error.response) {
          // O servidor respondeu com um status de erro (4xx, 5xx)
           this.cadastroErro = error.response.data.message || 'Erro no servidor ao cadastrar.';
        } else if (error.request) {
          // A requisição foi feita mas não houve resposta (backend offline, CORS, etc)
          this.cadastroErro = 'Não foi possível conectar ao servidor. Verifique sua conexão ou tente mais tarde.';
        } else {
          // Erro ao configurar a requisição
          this.cadastroErro = 'Erro ao enviar dados. Verifique os dados.';
        }
        this.cadastroSucesso = '';
      }
    },
  }
};
</script>

<style scoped>
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
  margin-top: 5px; /* Ajustado margin */
  margin-bottom: 10px;
  font-size: 0.9em;
}

.success {
  color: green;
  margin-top: 10px;
}
</style>