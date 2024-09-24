const fs = require('fs');
const path = require('path');


const reportsDir = path.join(__dirname, 'cypress/results');


const testFileName = process.env.CYPRESS_testFileName || 'unknown';


fs.readdir(reportsDir, (err, files) => {
  if (err) {
    console.error('Erro ao ler o diretório dos relatórios:', err);
    return;
  }

  files.forEach(file => {
    // Verifica se o arquivo de relatório é gerado pelo mochawesome
    if (file.includes('report')) {
      // Gera um novo nome de arquivo que inclui o nome do arquivo de teste
      const newFileName = file.replace('report', `report_${testFileName}`);
      const oldPath = path.join(reportsDir, file);
      const newPath = path.join(reportsDir, newFileName);

      // Renomeia o arquivo
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error(`Erro ao renomear o arquivo ${file}:`, err);
        } else {
          console.log(`Arquivo renomeado de ${file} para ${newFileName}`);
        }
      });
    }
  });
});
