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
        email: "tokenizacao_bandeira@getnet.com.br",
        card_brand: "Mastercard",
        card_pan_source: "ON_FILE",
        card_pan: "5204731600014784",
        security_code: "226",
        expiration_month: "12",
        expiration_year: "2023"
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
        'Authorization': `Bearer ${authToken}`,
      },
      body: {
        network_token_id: networkTokenId,
        transaction_type: "CIT ou MIT",
        cryptogram_type: "VISA_TAVV ou MC_DSRP_LONG",
        amount: 100,
        customer_id: "customer_45678900, 123.456.789-00 ou 12345678900",
        email: "tokenizacao_bandeira@getnet.com.br",
        card_brand: "VISA, MASTERCARD"
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
