"use strict";

const express = require("express");
const utils = require('./utils');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const app = express();

app.get('/authenticate', async (req, res) => {
    try {
        res.redirect(utils.requestUrlToGetAuthCodeFromAuthServer);
    } catch (error) {
        res.sendStatus(500);
        console.log(error.message);
    }
});

app.get(process.env.REDIRECT_URI, async (req, res) => {
    const authServerResponse = req.query;
    console.log("Auth Server Response", authServerResponse);
    try {
        // get auth server access token using authorization token
        const response = await utils.getAccessTokenFromAuthServer(authServerResponse.code);
        // get access token from payload
        const { access_token } = response.data;
        // get user profile data
        const user = await utils.getProfileDataFromAuthServer(access_token);
        const user_data = user.data;
        res.send(`
      <h1> welcome ${user_data.name}</h1>
      <img src="${user_data.picture}" alt="user_image" />
    `);
        console.log(user_data);
    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }
});

app.listen(PORT, () => {
    console.log("server is started on the port: ", PORT);
});
