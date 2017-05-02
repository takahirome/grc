# grc
## Environment
* lambda is serverless api app
    * npm run package-upload-update-function
* angular is web app on ec2
    * npm install -g yarn
    * yarn install

## Architecture
### Serverless API
* APIGW - lambda - Node.js(express)
### Library
* package.json

### Web Server
* EC2 AngularJS Node.js(express) - RDS(MySQL)
### Library
* yarn.lock

### Data structure
#### user
* id(PK)
* email
* password
* status
* timestamp

#### rank
* id(PK)
* domain
* keyword
* rank
* title
* url
* description
* status
* timestamp

#### stock
* id(PK)
* userid
* domain
* keyword
