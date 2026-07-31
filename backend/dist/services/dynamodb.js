"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ddbDocClient = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const config_1 = require("../config");
const client = new client_dynamodb_1.DynamoDBClient({
    region: config_1.config.awsRegion,
    // For local development without AWS credentials, you might want to uncomment these lines
    // and use a local dynamodb instance (e.g. DynamoDB local on port 8000)
    /*
    endpoint: "http://localhost:8000",
    credentials: {
      accessKeyId: "mock",
      secretAccessKey: "mock",
    },
    */
});
const marshallOptions = {
    convertEmptyValues: false,
    removeUndefinedValues: true,
    convertClassInstanceToMap: false,
};
const unmarshallOptions = {
    wrapNumbers: false,
};
const translateConfig = { marshallOptions, unmarshallOptions };
exports.ddbDocClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client, translateConfig);
