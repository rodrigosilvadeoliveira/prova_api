import { getAuthToken } from '../support/auth';

describe('Geração do token de acesso', () => {
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
        url: '/v1/tokens/card',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${authToken}`,
          'seller_id': sellerId 
        },
        body: {
          "card_number": "5155901222280001",
          "customer_id": "customer_21081826"
        },
        failOnStatusCode: false
      }).then((response) => {
        if (response.status !== 200) {
          cy.log('Falha na tokenização do cartão.');
          cy.log(response.body);
        }
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('card_token'); 
      });
    });
  });
  