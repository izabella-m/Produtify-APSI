<template>
  <v-form @submit.prevent="registrarProduto" ref="form">
    <v-container class="header-background" style="display: flex; justify-content: center;">
    </v-container>

    <v-container class="formContainer">
      <h1>Cadastrar novo produto</h1>

      <v-text-field 
        v-model="productData.Name"
        class="mt-12"
        placeholder="Nome do produto" 
        variant="outlined"
        :rules="[requiredNamenRule]"
      ></v-text-field>

      <v-text-field 
        v-model="productData.Price"
        @input="handlePriceInput"
        placeholder="Preço de venda" 
        variant="outlined"
        :rules="[requiredPricenRule]"
      ></v-text-field>
      
      <v-textarea 
        v-model="productData.Description"
        placeholder="Descrição"
        variant="outlined"
        :rules="[requiredDescriptionRule]"
      ></v-textarea>


      <v-text-field 
        v-model="productData.RandomCode"
        placeholder="Código do produto" 
        disabled 
        variant="outlined" 
      ></v-text-field>

      <h3>Opcionais</h3>
      <v-text-field 
        v-model="productData.PromotionalPrice"
        @input="handlePromotionalPriceInput"
        placeholder="Preço promocional" 
        variant="outlined" 
        persistent-hint
        hint="O preço de venda será riscado"
        class="mb-4"
      ></v-text-field>

      <v-select 
        v-model="productData.Category"
        :items="['Acessórios', 'Camisas', 'Shorts', 'Bermudas', 'Meias', 'Sapatos']"
        label="Selecione uma categoria"
        variant="outlined"
      ></v-select>

      <v-row justify="space-between">
        <v-col cols="auto">
          <v-switch 
            v-model="isSwitchOn" 
          ></v-switch>
        </v-col>
        <v-col cols="auto" class="mt-4">
          <p class="titleManageStock">Gerenciar estoque</p>
        </v-col>
      </v-row>
      

      <div v-if="isSwitchOn">
        <h3>Estoque</h3>
        <v-text-field 
          v-model="productData.Stock"
          placeholder="Estoque atual" 
          variant="outlined" 
          persistent-hint
          type="number"
          :rules="[minStockRule]"
        ></v-text-field>
        <v-text-field
          disabled
          variant="outlined" 
          >
            Estoque Mínimo
        </v-text-field>
      </div>

      <v-btn 
        class="btnFinishRegister text-none" 
        type="submit"
      >
        <p>Finalizar cadastro</p>
      </v-btn>
    </v-container>
  </v-form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Variáveis reativas para os campos do formulário
const form = ref(null);
const productData = ref({
  Name: '',
  Price: '',
  Description: '',
  PromotionalPrice: '',
  Stock: '',
  Category: '',
  Unit: '',
  RandomCode: ''
});

// Função para formatar preços com separadores de milhar e casas decimais
const formatPrice = (value) => {
  value = value.replace(/[^\d,]/g, ''); // Remove tudo, exceto números e vírgulas
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Formatação com ponto
  value = value.replace(/(\d+)(,)(\d{2})$/, '$1$2$3'); // Corrige para 2 casas decimais
  return value ? `R$ ${value}` : '';
};

// Função para limpar a formatação do valor antes de salvar no banco
const cleanFormattedPrice = (value) => {
  return value.replace(/[^\d,.-]/g, '').replace(',', '.'); // Remove formatação e corrige vírgula para ponto
};

// Funções de formatação específicas para cada campo
const handlePriceInput = (e) => {
  const rawValue = cleanFormattedPrice(e.target.value);
  const formattedPrice = formatPrice(rawValue); 
  productData.value.Price = formattedPrice; 
};

const handlePromotionalPriceInput = (e) => {
  const rawValue = cleanFormattedPrice(e.target.value);
  const formattedPrice = formatPrice(rawValue);
  productData.value.PromotionalPrice = formattedPrice; 
};


const minStockRule = value => value >= 1 || 'O estoque deve ser no mínimo 1 produto.';
const requiredDescriptionRule = value =>  !!value || 'Você precisa inserir uma descrição do produto.';
const requiredNamenRule = value =>  !!value || 'Você precisa inserir um nome para o produto.';
const requiredPricenRule = value =>  !!value || 'Você precisa inserir um preço para o produto.';
const isSwitchOn = ref(false);


function generateProductCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; 
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Gera o código quando o componente é montado
onMounted(() => {
  productData.value.RandomCode = generateProductCode();
});

// Função para registrar o produto
const registrarProduto = async () => {
  if (form.value.validate()) {
    try {
      // Preparar os dados para envio
      const productDataToSend = {
        Name: productData.value.Name,  // Acessando o valor de 'Name' corretamente
        Price: parseFloat(cleanFormattedPrice(productData.value.Price)), // Remove formatação antes de enviar
        Description: productData.value.Description,
        PromotionalPrice: productData.value.PromotionalPrice 
          ? parseFloat(cleanFormattedPrice(productData.value.PromotionalPrice)) 
          : null, // Remove formatação do preço promocional
        Category: productData.value.Category,
        Stock: parseInt(productData.value.Stock, 10),
        RandomCode: productData.value.RandomCode
      };

      // Fazer a requisição para o backend
      const response = await axios.post('http://localhost:5053/products', productDataToSend);

      // Sucesso
      console.log('Produto registrado com sucesso:', response.data);
      alert('Produto salvo com sucesso!');
      
      // Resetar o formulário
      form.value.reset();
      productData.value.RandomCode = generateProductCode(); 
    } catch (error) {
      // Tratar erro
      console.error('Erro ao salvar o produto:', error);
      alert('Erro ao salvar o produto. Verifique os dados e tente novamente.');
    }
  } else {
    console.log('Formulário inválido');
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto+Slab:wght@100..900&display=swap');

* {
  font-family: Inter;
}

template {
  color: #ecedee;
}

h1 {
  color: #000000; 
  margin-bottom: -15px;
}

.v-text-field {
  margin-bottom: 10px;
}

.header-background {
  max-width: 100%;
  height: 200px;
  background-color: rgb(206, 206, 206);
}

.formContainer {
  width: 50%;
}

v-sheet {
  margin: 0 auto;
}

.v-input__details {
  margin-top: -15px !important;
}

.titleManageStock {
  font-weight: 600 !important;
}

.btnFinishRegister {
  width: 100%;
  background: black;
}
.btnFinishRegister p {
  color: rgb(255, 255, 255) !important;
  letter-spacing: -1px;
}

.v-text-field .v-input__details {
  margin: 0px;
  padding-top: 20px;
}
</style>
