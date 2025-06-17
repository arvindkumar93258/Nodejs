const queryString = require('querystring');
const axios = require("axios");
require('dotenv').config();

const googleAccessTokenEndpoint = 'https://oauth2.googleapis.com/token';
const googleAuthTokenEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
const queryParams = {
    client_id: process.env.CLIENT_ID,
    redirect_uri: `http://localhost:4000${process.env.REDIRECT_URI}`,
};
// this objects contains information that will be passed as query params to the auth
// token endpoint
const authTokenParams = {
    ...queryParams,
    response_type: 'code',
};
// the scopes (portion of user's data) we want to access
const scopes = ['profile', 'email', 'openid'];
// a url formed with the auth server endpoint and the
const requestUrlToGetAuthCodeFromAuthServer = `${googleAuthTokenEndpoint}?${queryString.stringify(authTokenParams)}&scope=${scopes.join(' ')}`;

const getAccessTokenFromAuthServer = async authCode => {
    const accessTokenParams = {
        ...queryParams,
        client_secret: process.env.CLIENT_SECRET,
        code: authCode,
        grant_type: 'authorization_code',
    };
    return await axios({
        method: 'post',
        url: `${googleAccessTokenEndpoint}?${queryString.stringify(accessTokenParams)}`,
    });
};

const getProfileDataFromAuthServer = async accessToken => {
  return axios ({
    method: 'post',
    url: `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${accessToken}`,
  });
};

module.exports = {
    requestUrlToGetAuthCodeFromAuthServer,
    getAccessTokenFromAuthServer,
    getProfileDataFromAuthServer
};
