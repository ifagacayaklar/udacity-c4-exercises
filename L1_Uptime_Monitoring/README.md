# Uptime Monitoring

This project contains an AWS Lambda function that sends an HTTP request every minute and records following metrics for this request:
- If a request was successful or not
- Time it took to execute a request.

## Infrastructure
Project uses AWS infrastructure. AWS Lambda is used as FaaS and it is triggered by AWS CloudWatch.

## Quickstart

- Install dependencies: `npm install`
- Zip the code for upload: `npm run package`
- Create a Lambda function in AWS and upload code as zip file
- Set following environment variables in AWS Lambda Function page: 
  - `SERVICE_NAME` : Desired name for service
  - `URL` : Http source to monitor
- Update [Lambda Function role](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html) in AWS IAM to allow access to record logs on CloudWatch
- Create a [CloudWatch events rule](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/Create-CloudWatch-Events-Scheduled-Rule.html) that triggers on a schedule and select Lambda function as downstream.
- Go to Metrics page and select "*Uptime_Monitor/Serverless*" under Custom Namespaces. 