const AWS = require('aws-sdk')
const axios = require('axios')

// Name of a service, any string
const serviceName = process.env.SERVICE_NAME
// URL of a service to test
const url = process.env.URL
// CloudWatch client
const cloudwatch = new AWS.CloudWatch();

exports.handler = async (event) => {
  let endTime
  let isHealthy

  const startTime = Date.now()
  try {
    await axios.get(url)
    isHealthy = 1 
  } catch {
    isHealthy = 0
  } finally {
    endTime = Date.now()
  }

  const latency = endTime - startTime;

  recordMetric("Health", "Count", isHealthy);
  recordMetric("Latency", "Milliseconds", latency);
}


const recordMetric = async (metricName, unit, value) => {
  await cloudwatch.putMetricData({
    MetricData: [
      {
        MetricName: metricName, 
        Dimensions: [
          {
            Name: 'ServiceName',
            Value: serviceName
          }
        ],
        Unit: unit, 
        Value: value 
      }
    ],
    Namespace: 'Uptime_Monitor/Serverless'
  }).promise()
}
