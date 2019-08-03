# soundti.me

**soundti.me** is a music sharing website whose architecture is entirely serverless: it heavily depends on **Amazon Web Services** for distribution (*AWS CloudFront*), routing (*AWS Route 53*), storage for the website SPA and data (*AWS S3*) and interaction with the graphical front-end (*AWS API Gateway* and *AWS Lambda*).

## AWS and its usage

### CloudFront

### Route 53

### API Gateway

### Lambda

### S3

#### Uploads

Uploads are done directly to S3 by generating a single use pre-signed URL that can be used to execute a PUT request towards the S3 bucket named `soundtime-data`; the URL also encodes what the name of the file will be once uploaded.

### DynamoDB

