import { getAuthToken } from '../support/auth';

describe('API Test with Bearer Token and Card Tokenization', () => {
  let authToken = '';
  const sellerId = 'your-seller-id-uuidv4';

  before(() => {

    getAuthToken().then((token) => {
      authToken = token;
    });
  });

  it('Geração do token do cartão', () => {
    if (!authToken) {
      cy.log('Token de autenticação não foi obtido, abortando o teste.');
      return;
    }

    cy.request({
      method: 'POST',
      url: '/v1/tokenization/token',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${authToken}`
      },
      body: {
        customer_id: "customer_45678900",
        card_pan: "4622943120000493",
        card_pan_source: "ON_FILE",
        card_brand: "Mastercard",
        expiration_year: "2023",
        expiration_month: "12",
        security_code: "1234",
        email: "tokenizacao_bandeira@getnet.com.br"
      },
      failOnStatusCode: false
    }).then((response) => {
      if (response.status !== 200) {
        cy.log('Falha ao obter o network_token_id.');
        cy.log(response.body);
      } else {
        networkTokenId = response.body.network_token_id;
        const status = response.body.status;
        cy.log('Network Token ID obtido com sucesso: ' + networkTokenId);
        cy.log('Status da tokenização: ' + status);
      }
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('networkTokenId').and.to.be.a('string');
      expect(response.body).to.have.property('status').and.to.be.a('string');
    });
  });
  it('Geração de criptograma do cartão', () => {

    if (!networkTokenId) {
      cy.log('Network Token ID não foi obtido, abortando o teste.');
      return;
    }

    cy.request({
      method: 'POST',
      url: `/v1/some/endpoint/v1/tokenization/crypt`,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${authToken}`,
      },
      body: {
        network_token_id: networkTokenId,
        transaction_type: "MIT",
        cryptogram_type: "MC_DSRP_LONG",
        amount: 100,
        customer_id: "customer_45678900",
        email: "tokenizacao_bandeira@getnet.com.br",
        card_brand: "MASTERCARD"
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('cryptogram').and.to.be.a('string');
      expect(response.body).to.have.property('token_pan_card').and.to.be.a('number');
      expect(response.body).to.have.property('token_expiration_month').and.to.be.a('number');
      expect(response.body).to.have.property('token_expiration_year').and.to.be.a('number');
      expect(response.body).to.have.property('token_status').and.to.be.a('string');
    });
  });
});
