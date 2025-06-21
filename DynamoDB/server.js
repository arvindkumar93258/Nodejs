// // npm install @opensearch-project/opensearch @opensearch-project/opensearch/aws aws-sdk

const { Client } = require('@opensearch-project/opensearch');
const { awsGetCredentials, awsConnector } = require('@opensearch-project/opensearch/aws');
const AWS = require('aws-sdk');

const region = process.env.AWS_REGION || 'us-west-2';
const endpoint = 'ledger.aqueralabs.com';  // include protocol here
const indexName = 'orchestrationlogs';

async function main() {
    // fetch AWS creds
    const creds = await awsGetCredentials({ AWS, region });

    // create the client
    const client = new Client({
        ...awsConnector({
            credentials: creds,
            region,
            service: 'es',
        }),
        node: endpoint
    });

    // run a sample search
    const response = await client.search({
        index: indexName,
        body: { query: { match_all: {} } }
    });

    console.log('Hits:', response.body.hits.hits);
}

main().catch(console.error);

// const AWS = require("aws-sdk")
// const sts = new AWS.STS();
// async function main(params) {
//     await sts.getCallerIdentity().promise()
//       .then(i => console.log("Signing as:", i))
//       .catch(console.error);
    
// }
// main()
