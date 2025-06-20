// crud.js
const docClient = require("./ddbClient");
const TABLE = process.env.ACCOUNTS_TABLE || 'MyTable';

/**
 * CREATE an item
 */
async function createItem(item) {
    await docClient.put({
        TableName: process.env.ACCOUNTS_TABLE || 'MyTable',
        Item: item,
        // Prevent overwriting:
        ConditionExpression: 'attribute_not_exists(id)'
    }).promise();
    console.log('✔ Created', item);
}

/**
 * READ one item by PK
 */
async function getItem(id) {
    const { Item } = await docClient.get({
        TableName: process.env.ACCOUNTS_TABLE || "Accounts", // Table name of from which you want to fetch the data.
        Key: { id } // primary key or partition key from the table to get the data by id
    }).promise();
    console.log('🔍 Fetched', Item);
    return Item;
}

/**
 * UPDATE one item
 */
async function updateItem(id, updates) {
    // build SET expression
    const expr = [];
    const names = {};
    const values = {};
    let i = 0;
    for (const [k, v] of Object.entries(updates)) {
        const n = `#f${i}`, val = `:v${i}`;
        expr.push(`${n} = ${val}`);
        names[n] = k;
        values[val] = v;
        i++;
    }
    const { Attributes } = await docClient.update({
        TableName: process.env.TABLE_NAME || "Accounts",
        Key: { id },
        UpdateExpression: 'SET ' + expr.join(', '),
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: 'ALL_NEW'
    }).promise();
    console.log('✏️ Updated to', Attributes);
    return Attributes;
}

/**
 * DELETE one item
 */
async function deleteItem(id) {
    await docClient.delete({
        TableName: process.env.ACCOUNTS_TABLE || "Accounts",//table name of from which you want to fetch the data.
        Key: { id }, // primary key or partition key from the table to get the data by id
        ConditionExpression: 'attribute_exists(id)'
    }).promise();
    console.log('🗑️ Deleted', id);
}

/**
 * LIST all items (scan)
 */
async function listItems() {
    let items = [], lastKey;
    do {
        const resp = await docClient.scan({
            TableName: process.env.ACCOUNTS_TABLE || "Accounts", //table name of from which you want to fetch the data.
            ExclusiveStartKey: lastKey // this is being used for the pagination to get the next page
        }).promise();
        items = items.concat(resp.Items);
        lastKey = resp.LastEvaluatedKey;
    } while (lastKey);
    console.log('📜 All items:', items);
    return items;
}

/**
 * @description: This function runs the filter on username in the Accounts table
 * @param {email} email
 * @returns: list of the the documents where owner is <email>
 */
async function findByOwnerEmail(email) {
    try {
        const params = {
            // TableName: process.env.ACCOUNTS_TABLE || "Accounts",
            // // Only reads the documents where certification owner is "email"
            // FilterExpression: "contains (createdBy, :owner)",
            // ExpressionAttributeValues: {
            //     ":owner": email
            // }
            TableName: process.env.ACCOUNTS_TABLE,
            FilterExpression: "#cb = :email",
            ExpressionAttributeNames: {
                "#cb": "username"
            },
            ExpressionAttributeValues: {
                ":email": email
            },
            // Limit: 10
        }
        let list = [];
        let lastEvaluatedKey;

        do {
            // if (lastEvaluatedKey) {
            //     params.ExclusiveStartKey = lastEvaluatedKey;
            // }
            const response = await docClient.scan(params).promise();
            const { Items, LastEvaluatedKey } = response;
            list = list.concat(Items);
            lastEvaluatedKey = LastEvaluatedKey;
        } while (false)
        console.log("Total docs is: ", list.length);
        console.log(list);
        return list;
    } catch (error) {
        console.log("Error occurred while findByOwnerEmail:", error);
        return;
    }
}

module.exports = { createItem, getItem, updateItem, deleteItem, listItems, findByOwnerEmail };
