<template>
    <div>
      <h2>Cadastro</h2>
      <label for="nome">Nome:</label>
      <input type="text" id="nome" v-model="nome" required><br>
  
      <label for="telefone">Telefone:</label>
      <input type="tel" id="telefone" v-model="telefone" @input="updateTelefone" pattern="^\\+\\d{2}\\d{10,11}$" required><br>
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
  
  const BACKEND_URL = 'http://localhost:3001';  // Substitua pela URL do Railway
  
  export default {
    data() {
      return {
        nome: '',
        telefone: '+55',
        placa: '',
        cadastroErro: '',
        cadastroSucesso: '',
        telefoneInvalido: false,
      };
    },
    methods: {
      updateTelefone() {
        if (!this.telefone.startsWith('+55') && this.telefone !== '+55') {
          this.telefone = '+55' + this.telefone.replace('+55', '');
        }
      },
      async cadastrarMotorista() {
        this.telefoneInvalido = false; // Resetar o erro
        if (!/^\+\d{2}\d{10,11}$/.test(this.telefone)) {
          this.telefoneInvalido = true;
          return;
        }
  
        try {
          const response = await axios.post(`${BACKEND_URL}/cadastrar`, {
            nome: this.nome,
            telefone: this.telefone,
            placa: this.placa
          });
          this.cadastroSucesso = response.data.message;
          this.cadastroErro = '';
          this.$emit('form-submitted'); // Emitir evento para a tela principal
        } catch (error) {
          this.cadastroErro = 'Erro ao cadastrar. Verifique os dados.';
          this.cadastroSucesso = '';
          console.error(error);
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
    margin-top: 10px;
  }
  
  .success {
    color: green;
    margin-top: 10px;
  }
  </style>