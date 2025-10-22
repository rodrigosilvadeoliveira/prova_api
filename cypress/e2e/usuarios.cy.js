

describe('API Test usuarios', () => {
  
   it('Lista de usuarios', () => {

    cy.request({
      method: 'GET',
      url: '/usuarios',
     
    }).then((response) => {
      if (response.status !== 200) {
        cy.log('Falha ao obter retorno da API');
        cy.log(response.body);
      } else {
       
        const status = response.status;
       
        cy.log('Status da lista de usuarios: ' + status);
        console.log('Status da lista de usuarios: ' + status);
      }
      expect(response.status).to.eq(200);
    });
  });
  it('Cadastro Usuario', () => {

    cy.request({
      method: 'POST',
      url: '/usuarios',
       headers: {
         'Accept': 'application/json',
        'Content-Type':  'application/json'
       },
       body: {
  "nome": "Teste Silva",
  "email": "silva.teste12@qa.com.br",
  "password": "teste1",
  "administrador": "true"
},
      
    }).then((response) => {
      if (response.status !== 201) {
        cy.log('Falha ao obter retorno da API Cadastro');
        cy.log(response.body);
      } else {
       
        const status = response.status;
        const id = response.body._id;
       
        cy.log('Status cadastro: ' + status);
        console.log('Status cadastro: ' + status);
        console.log('Usuario cadastrado com ID: ' + id);
        Cypress.env('usuarioId', id);
      }
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('message').and.to.be.a('string');
      expect(response.body).to.have.property('_id').and.to.be.a('string');
    });
  });

  it('Consulta usuario cadastrado', () => {
  const id = Cypress.env('usuarioId');
  cy.log('Usando ID do usuário: ' + id);

  cy.request({
    method: 'GET',
    url: `/usuarios/${id}`
  }).then((response) => {
    expect(response.status).to.eq(200);

  });
});

it('Atualizar usuario cadastrado', () => {
  const id = Cypress.env('usuarioId');
  expect(id, 'ID do usuário deve estar definido').to.exist;

  const requestBody = {
    nome: "Teste Silva ",
    email: `silva.${id}@qa.com.br`,
    password: "teste1",
    administrador: "true"
  };

  cy.request({
    method: 'PUT',
    url: `/usuarios/${id}`,
    body: requestBody,
  }).then((response) => {
    expect(response.status).to.eq(200);

    // Salva os valores que sabemos que foram enviados
    Cypress.env('usuarionome', requestBody.nome);
    Cypress.env('usuarioemail', requestBody.email);
    Cypress.env('usuariopassword', requestBody.password);
    Cypress.env('usuarioadministrador', requestBody.administrador);
  });
});


it('Consulta Atualização cadastrado', () => {
  
   const id = Cypress.env('usuarioId');
   const nome = Cypress.env('usuarionome'); 
   const email = Cypress.env('usuarioemail'); 
   const password = Cypress.env('usuariopassword'); 
   const administrador = Cypress.env('usuarioadministrador');
  
  cy.log('Usando ID do usuário: ' + id);

  cy.request({
    method: 'GET',
    url: `/usuarios/${id}`
  }).then((response) => {
    expect(response.status).to.eq(200);

    
    expect(response.body.nome).to.eq(nome)
    expect(response.body.email).to.eq(email)
    expect(response.body.password).to.eq(password)
    expect(response.body.administrador).to.eq(administrador)

  });
});

it('Excluir usuario cadastrado', () => {

  const id = Cypress.env('usuarioId');
  const nome = Cypress.env('usuarioId');
  const email = Cypress.env('usuarioemail');
  const password = Cypress.env('usuariopassword');
  const administrador = Cypress.env('usuarioadministrador');
  

  cy.request({
    method: 'DELETE',
    url: `/usuarios/${id}`,
    body: {
    "nome": nome,
    "email": email,
    "password": password,
    "administrador": administrador
},
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.message).to.eq("Registro excluído com sucesso")
  });
});

});
