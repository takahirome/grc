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

## Data structure
### user
* id(PK)
* email
* password
* status
* timestamp

### rank
* id(PK)
* domain
* keyword
* rank
* title
* url
* description
* status
* timestamp

### stock
* id(PK)
* userid
* domain
* keyword

## encode decode
* job -> api
    * encodeURIComponent(jconv.convert(callStocksResultsJson[i].keyword,'UTF8','JIS'))
    * Step1. UTF8 -> JIS
    * Step2. JIS -> encode
    * Ex. callStocksResultsJson[i].keyword : デザイン
* api -> cheerio query
    * jconv.decode(req.query.keyword,'JIS')
    * Step1. JIS decode
* cheerio result -> mysql
    * 'keyword':jconv.decode(keyword,'JIS')
    * Step1. JIS decode
