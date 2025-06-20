// createTable.js
"use strict";

require("dotenv").config();
const AWS = require("aws-sdk");

// Initializing the dynamo db and get connected
const dynamoDB = new AWS.DynamoDB({
    region: process.env.AWS_REGION || "us-west-2"
});

async function createTableIfNotExists(tableName) {
    try {
        // Calling DynamoDB to describe the table, If the table exist then they will give the metadata of the table
        const result = await dynamoDB.describeTable({ TableName: TABLE_NAME }).promise();
        // If it did not throw the error means the table exist and then printing the table metadata.
        console.log(result);
    } catch (error) {
        // If the above code throws error
        if (error.code == "ResourceNotFoundException") {
            // Scenario:1. If the error is ResourceNotFoundException then It means the table does not exist then, we need to create the table.
            const params = {
                TableName: tableName, // Table name which is being created
                AttributeDefinitions: [
                    { AttributeName: 'id', AttributeType: 'S' }
                ],
                KeySchema: [
                    { AttributeName: 'id', KeyType: 'HASH' }
                ],
                ProvisionedThroughput: { // Provisioning the aws for the read write, is is optional
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            };
            console.log(`🚀 Creating table "${tableName}"...`);
            await dynamo.createTable(params).promise();
            console.log(`✅ Table "${tableName}" created successfully.`);
        } else {
            // Scenario: 2. If is is other error then throwing the error.
            console.error('❌ Unexpected error checking/creating table:', err);
            throw err;
        }
    }
}

async function deleteTableIfExists(tableName) {
    try {
        const response = await dynamoDB.describeTable({ TableName: tableName });
        // If the table exist then they will not throw any error and will return the metadata in the response.
        console.log(`🚀 Deleting table "${tableName}"... and existing table metadata is ${response}`);
        //Now delete the table
        await dynamoDB.deleteTable({ TableName: tableName });
        console.log(`✅ Table "${tableName}" deleted.`);
    } catch (error) {
        console.error('❌ Error deleting table:', err);
        throw err;
    }
}

async function updateTableThroughput(tableName, readCapacity, writeCapacity) {
    try {
        console.log(`🚀 Updating throughput for "${tableName}" to RCU=${readCapacity}, WCU=${writeCapacity}...`);
        const params = {
            TableName: tableName,
            ProvisionedThroughput: {
                ReadCapacityUnits: readCapacity,
                WriteCapacityUnits: writeCapacity
            },
            // If need to update the secondary Index then that can be updates using below attribute addition.
            GlobalSecondaryIndexUpdates: [
                { Create: { IndexName: 'MyGSI', /* …definition… */ } },
                { Delete: { IndexName: 'OldGSI' } }
            ]
        };
        const resp = await dynamo.updateTable(params).promise();
        console.log('✅ Update initiated:', resp.TableDescription.TableStatus);

    } catch (error) {
        console.error('❌ Error updating the table:', err);
        throw err;


    }
}

module.exports = {
    createTableIfNotExists,
    deleteTableIfExists,
    updateTableThroughput
};
