// Função para codificar o Client ID e Client Secret em Base64
const getAuthHeader = (clientId, clientSecret) => {
    return 'Basic ' + btoa(`${clientId}:${clientSecret}`);
  };
  
  // Função para obter o token de autenticação
  export const getAuthToken = () => {
    const clientId = '67823c6d-58de-494f-96d9-86a4c22682cb';
    const clientSecret = 'c2d6a06f-5f31-448b-9079-7e170e8536e4';
  
    return cy.request({
      method: 'POST',
      url: '/auth/oauth/v2/token',
      headers: {
        'Authorization': getAuthHeader(clientId, clientSecret),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        grant_type: 'client_credentials',
        scope: 'oob'
      },
      form: true
    }).then((response) => {
      expect(response.status).to.eq(200);
      return response.body.access_token; // Retorna o token de acesso
    });
  };
  