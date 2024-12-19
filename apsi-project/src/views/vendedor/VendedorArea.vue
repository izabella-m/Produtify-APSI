<template>
    <v-container fluid>
      <v-app-bar app color="primary" dark>
        <v-toolbar-title>Área do Vendedor</v-toolbar-title>
      </v-app-bar>
  
      <v-row>
        <v-col cols="12" md="3">
          <v-navigation-drawer app permanent>
            <v-list dense>
              <v-list-item>
                <v-list-item-title>Navegação</v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-list-item
                link
                to="/areadovendedor/cadastrarnovoproduto"
              >
                <v-list-item-icon>
                  <v-icon>mdi-plus-box</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Cadastrar Novo Produto</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-col>
        <v-col cols="12" md="9">
          <!-- Aqui as rotas filhas serão renderizadas -->
          <router-view />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "VendedorArea",
  };
  </script>
  
  <style scoped>
  /* Estilos específicos podem ser adicionados aqui */
  </style>
  