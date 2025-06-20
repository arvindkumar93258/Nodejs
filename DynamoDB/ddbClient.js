// ddbClient.js
"use strict";
const AWS = require("aws-sdk");

require("dotenv").config();

const environment = process.env.ENVIRONMENT || "local";

const config = {
    region: process.env.AWS_REGION || 'us-west-2'
};
if (environment == "local") {
    config.endpoint = 'http://localhost:8000';
}

const docClient = new AWS.DynamoDB.DocumentClient(config);
module.exports = docClient;
