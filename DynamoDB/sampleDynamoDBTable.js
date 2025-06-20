//sampleDynamoDBTable.js
"use struct";

const Accounts = {
    "id": {
        "S": "bcff7df5-a6d0-4626-8a84-123456723e6a"
    },
    "active": {
        "BOOL": true
    },
    "billingStatus": {
        "BOOL": false
    },
    "discountPercentage": {
        "N": "0"
    },
    "enableOrchestration": {
        "BOOL": true
    },
    "enableSMB": {
        "BOOL": false
    },
    "TenantID": {
        "S": "5d823c328c"
    },
    "tenantName": {
        "S": "TEST"
    },
    "username": {
        "S": "arvind.kumar@aquera.com"
    },
    "users": {
        "L": [
            {
                "M": {
                    "email": {
                        "S": "arvind.kumar@aquera.com"
                    },
                    "role": {
                        "S": "owner"
                    }
                }
            }
        ]
    }
};
