const path = require('path');
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://api-homologacao.getnet.com.br',
    setupNodeEvents(on, config) {
      on('before:spec', (spec) => {
        const fileName = path.basename(spec.relative, '.js'); 
        config.env.testFileName = fileName;
        return config;
      });
    }
  },
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,
    html: true,
    json: true,
    timestamp: "mmddyyyy_HHMMss",
    reportFilename: 'report'
  }
});
