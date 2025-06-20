# DynamoDB CRUD with Node.js

This guide walks you through:

1. **Install & Configure AWS Credentials**
2. **(Optional) Spin Up a Local DynamoDB for Development**
3. **Set Up Your Node.js Project**
4. **Initialize the DynamoDB Client**
5. **CRUD Examples**

---

## 1. Install & Configure AWS Credentials

1. **Install the AWS CLI** (optional, but useful):

   ```bash
   # macOS (Homebrew)
   brew install awscli

   # Ubuntu/Debian
   sudo apt-get update && sudo apt-get install awscli
   ```

2. **Configure your credentials**:

   ```bash
   aws configure
   ```

   Enter your values when prompted:

   ```text
   AWS Access Key ID [None]: YOUR_AWS_ACCESS_KEY_ID
   AWS Secret Access Key [None]: YOUR_AWS_SECRET_ACCESS_KEY
   Default region name [None]: us-west-2
   Default output format [None]: json
   ```

   This writes your keys to `~/.aws/credentials` and configures the default region.

---

## 2. (Optional) Spin Up a Local DynamoDB for Development

To avoid interacting with a live AWS account, you can run DynamoDB locally:

1. **Download and extract DynamoDB Local**:

   ```bash
   wget https://s3.us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.zip
   unzip dynamodb_local_latest.zip -d dynamodb_local
   ```

2. **Run DynamoDB Local**:

   ```bash
   cd dynamodb_local
   java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
   ```

3. **Endpoint URL**: `http://localhost:8000`

You can now point your application at this endpoint to develop offline.

---

## 3. Set Up Your Node.js Project

1. **Create a new project**:

   ```bash
   mkdir my-ddb-app && cd my-ddb-app
   npm init -y
   ```

2. **Install dependencies**:

   ```bash
   npm install aws-sdk
   ```

3. **(Optional) Install a linter or formatter**:

   ```bash
   npm install --save-dev eslint prettier
   ```

---

## 4. Initialize the DynamoDB Client

Create a file `ddbClient.js` in your project root:

```js
// ddbClient.js
const AWS = require('aws-sdk');

// Toggle local vs AWS-based DynamoDB
const isLocal = process.env.DDB_LOCAL === 'true';

const config = {
  region: process.env.AWS_REGION || 'us-west-2',
};

if (isLocal) {
  config.endpoint = 'http://localhost:8000';
}

const docClient = new AWS.DynamoDB.DocumentClient(config);

module.exports = docClient;
```

* Set `DDB_LOCAL=true` in your environment to use the local endpoint.
* Otherwise, it will connect to AWS in the configured region.

---

## 5. CRUD Examples

Create a file `crud.js` alongside `ddbClient.js`:

```js
// crud.js
const docClient = require('./ddbClient');
const TABLE = process.env.TABLE_NAME || 'MyTable';

// CREATE
async function createItem(item) {
  await docClient.put({
    TableName: TABLE,
    Item: item,
    ConditionExpression: 'attribute_not_exists(id)'
  }).promise();
  console.log('✔ Created item', item);
}

// READ
async function getItem(id) {
  const { Item } = await docClient.get({
    TableName: TABLE,
    Key: { id }
  }).promise();
  console.log('🔍 Retrieved item:', Item);
  return Item;
}

// UPDATE
async function updateItem(id, updates) {
  const expr = [];
  const names = {};
  const values = {};
  let i = 0;

  for (const [k, v] of Object.entries(updates)) {
    const nameKey = `#f${i}`;
    const valKey = `:v${i}`;
    expr.push(`${nameKey} = ${valKey}`);
    names[nameKey] = k;
    values[valKey] = v;
    i++;
  }

  const { Attributes } = await docClient.update({
    TableName: TABLE,
    Key: { id },
    UpdateExpression: 'SET ' + expr.join(', '),
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    ReturnValues: 'ALL_NEW'
  }).promise();

  console.log('✏️ Updated item:', Attributes);
  return Attributes;
}

// DELETE
async function deleteItem(id) {
  await docClient.delete({
    TableName: TABLE,
    Key: { id },
    ConditionExpression: 'attribute_exists(id)'
  }).promise();
  console.log('🗑️ Deleted item with ID:', id);
}

// LIST (Scan)
async function listItems() {
  let items = [];
  let lastKey;
  const params = { TableName: TABLE };

  do {
    if (lastKey) params.ExclusiveStartKey = lastKey;
    const { Items, LastEvaluatedKey } = await docClient.scan(params).promise();
    items = items.concat(Items);
    lastKey = LastEvaluatedKey;
  } while (lastKey);

  console.log('📜 All items:', items);
  return items;
}

module.exports = { createItem, getItem, updateItem, deleteItem, listItems };
```

### Usage Example

Create an `index.js` file:

```js
// index.js
require('dotenv').config();
const { createItem, getItem, updateItem, deleteItem, listItems } = require('./crud');

(async () => {
  const testItem = { id: '1', name: 'Alice', age: 30 };
  await createItem(testItem);
  await getItem('1');
  await updateItem('1', { age: 31, title: 'Engineer' });
  await listItems();
  await deleteItem('1');
})();
```

Run the script:

```bash
# Use local DynamoDB? Uncomment:
# export DDB_LOCAL=true
export AWS_REGION=us-west-2
export TABLE_NAME=MyTable

node index.js
```

---

You now have a working Node.js project that connects to DynamoDB, supports local development, and demonstrates all CRUD operations.
