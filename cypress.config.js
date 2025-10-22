const path = require('path');
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://serverest.dev',
    setupNodeEvents(on, config) {
      on('before:spec', (spec) => {
        const fileName = path.basename(spec.relative, '.js'); 
        config.env.testFileName = fileName;
        return config;
      });
      on('after:spec', (spec, results) => {
        if (results && results.stats.failures === 0) {
          // Tira screenshots de todos os testes que passaram
          results.tests.forEach((test) => {
            if (test.state === 'passed') {
              const screenshotPath = `cypress/screenshots/${spec.name}/${test.title} -- passed.png`;
              on('after:screenshot', () => {
                cy.screenshot(screenshotPath);
              });
            }
          });
        }
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
    reportFilename: `[name]`
  }
});
