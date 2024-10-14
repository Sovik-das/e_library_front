export const oktaConfig ={
    clientId:'0oahd4czhaa82bjMO5d7',
    issuer:'https://dev-93877035.okta.com/oauth2/default',
    redirectUri:'https://localhost:3000/login/callback',
    scopes:['openid','profile','email'],
    pkce:true,
    disableHttpsCheck:true
}