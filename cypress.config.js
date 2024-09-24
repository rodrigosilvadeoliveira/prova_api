const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://api-homologacao.getnet.com.br', // Defina aqui a base URL
  },
});
