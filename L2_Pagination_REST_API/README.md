# Rest API GET DynamoDB Pagination

This project contains an AWS Lambda function that sends an HTTP request to get limited number of entry from a AWS DynamoDB

## Infrastructure
Project uses AWS infrastructure. AWS Lambda is used as FaaS and it is triggered by AWS API Gateway HTTP `GET` request.

## Quickstart
- Create DynamoDB table on AWS
- Create a Lambda function in AWS and upload
- Set following environment variables in AWS Lambda Function page: 
  - `GROUP_TABLE` : DynamoDB table name
- Update [Lambda Function role](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html) in AWS IAM to allow access to scan dynamo db using template in *iam-policy.json* file.
- Create API Gateway using AWS or other services which triggers the lambda function created on `/groups` path
- Use Postman or browser to test via 
  - `https://{{apiId}}.execute-api.{{awsRegion}}.amazonaws.com/dev/groups?limit=2` : Get 2 entry from Dynamo db 
  
      Output : 
      ```json
      {
        "items": [
            {
                "id": "1",
                "name": "Lorem"
            },
            {
                "id": "2",
                "name": "Ipsum"
            }
        ],
        "nextKey": "%7B%22id%22%3A%222%22%7D"
      }
      ```
  - :Include `nextKey` into query parameters to get next entries: 
  
    `https://{{apiId}}.execute-api.{{awsRegion}}.amazonaws.com/dev/groups?limit=1&nextKey=%7B%22id%22%3A%222%22%7D`

    Output

    ```json
      {
        "items": [
            {
                "id": "3",
                "name": "Third Entry"
            }
        ],
        "nextKey": "%7B%22id%22%3A%223%22%7D"
      }
    ```
