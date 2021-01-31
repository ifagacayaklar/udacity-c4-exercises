'use strict'

const AWS = require('aws-sdk')

const docClient = new AWS.DynamoDB.DocumentClient()

const groupsTable = process.env.GROUPS_TABLE

exports.handler = async (event) => {
  console.log('Processing event: ', event)
  let nextKey
  let limit 
  try {
    nextKey = getNextKey(event)
    limit = getLimit(event) || 5
  } catch (err) {
    console.log("Failed to get query")
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  }

  // Scan operation parameters
  const scanParams = {
    TableName: groupsTable,
    Limit: limit,
    ExclusiveStartKey: nextKey
  }
  console.log('Scan params: ', scanParams)

  const result = await docClient.scan(scanParams).promise()

  const items = result.Items

  console.log('Result: ', result)

  // Return result
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items,
      // Encode the JSON object so a client can return it in a URL as is
      nextKey: encodeNextKey(result.LastEvaluatedKey)
    })
  }
}

function getQueryParameter(event, name) {
  const queryParams = event.queryStringParameters
  if (!queryParams) {
    return undefined
  }

  return queryParams[name]
}

function encodeNextKey(lastEvaluatedKey) {
  if (!lastEvaluatedKey) {
    return null
  }

  return encodeURIComponent(JSON.stringify(lastEvaluatedKey))
}

function getNextKey(event) {
  const nextKey = getQueryParameter(event, "nextKey")
  if (!nextKey) {
    return undefined
  }else{
    return JSON.parse(decodeURIComponent(nextKey));
  }
}

function getLimit(event){
  let limit = getQueryParameter(event, 'limit')
  if (!limit){
    return undefined
  }
  limit = parseInt(limit, 5)
  if (limit <= 0){
    throw new Error("Limit cannot be negative")
  } 
  return limit
}