describe('API Test', () => {
  it('should obtain an access token', () => {
    const clientId = '67823c6d-58de-494f-96d9-86a4c22682cb';
    const clientSecret = 'c2d6a06f-5f31-448b-9079-7e170e8536e4';
    
    
    const authHeader = 'Basic ' + btoa(`${clientId}:${clientSecret}`);

    cy.request({
      method: 'POST',
      url: '/auth/oauth/v2/token',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        scope: 'oob',
        grant_type: 'client_credentials'
      },
      form: true 
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('access_token');
    });
  });
});

