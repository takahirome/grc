var express = require('express');
var path = require('path');
var app = express();
var rankdao = require('./src/dao/rank.dao.js');
var userdao = require('./src/dao/user.dao.js');
var stockdao = require('./src/dao/stock.dao.js');
var jobservice = require('./src/service/job.service.js');
var bodyParser = require('body-parser');

app.use('/',express.static(path.join(__dirname,'public')));
app.use('/angular',express.static(path.join(__dirname,'node_modules','angular')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

app.get('/rank', rankdao.read); // GETの処理
app.get('/ranks', rankdao.readall); // GETの処理
app.post('/rank', rankdao.save); // POSTの処理
app.get('/user', userdao.read); // GETの処理
app.post('/user', userdao.save); // POSTの処理
app.post('/deleteuser', userdao.delete); // DELETEの処理
app.get('/stock', stockdao.read); // GETの処理
app.get('/stocks', stockdao.readall); // GETの処理
app.post('/stock', stockdao.save); // POSTの処理
app.post('/deletestock', stockdao.delete); // DELETEの処理

app.get('/job', jobservice.job); // GETの処理

app.listen(3000);