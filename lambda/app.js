'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const app = express()
const cheerioClient = require('cheerio-httpcli');
require('date-utils');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(awsServerlessExpressMiddleware.eventContext())

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})

app.get('/scrape', (req, res) => {
  /*
      [scraping.js]

      encoding=utf-8
  */

  // cheerio-cliでの検索結果（リスト型を想定）を
  // 適当に要約して返却する。
  // clearly = function( cheerio-httpcli::$ ); が要約する関数。
  //
  var searchClearly = function( url, request, clearly ){
      var promiseCheerio = cheerioClient.fetch( url, request );

      return new Promise(function (resolve, reject) {
          promiseCheerio.then( function( cheerioResult ){
              if( cheerioResult.error ){
                  reject( cheerioResult.error );
              }else{
                  // レスポンスヘッダを参照
                  // console.log("レスポンスヘッダ");
                  // console.log( cheerioResult.response.headers);

                  // リンク一覧を生成
                  var $ = cheerioResult.$;
                  resolve({
                      "clearlyList" : clearly( $ ),
                      "cheerioJQuery" : $
                  });
              }
          }, function( error ){
              reject( error );
          });
      });
  }

  // グーグル検索結果をリスト形式で取得する。
  // request = 検索オブジェクト { q: "node.js" } の形式で指定。
  //
  var searchClearlyByGoogle = function( request ){
      return searchClearly( "http://www.google.com/search?hl=ja", request, function( $ ){
          //登録日
          var dt = new Date();
          var yyyymmdd = dt.toFormat("YYYYMMDD");//YYYYMMDDHH24MISS
          var timestamp = dt.toFormat("YYYYMMDDHH24MISS");//YYYYMMDDHH24MISS

          //結果格納
          var results = [];
          $("div[class='g']").each( function (idx) {
              var target = $(this);
              var anchor = target.find("a").eq(0);
              var summary = target.find("span[ class='st'] ").eq(0);
              if(anchor.attr("href").match(req.query.domain)){
                results.push({
                    "domain": req.query.domain,
                    "keyword": req.query.keyword,
                    "rank" : idx+1,
                    "title" : anchor.text(),
                    "url" : anchor.attr("href"),
                    "description" : summary.text()
                });
              }
          });
          return results;
      });
  };


  /*
  // DynamoDBでgrc_rankテーブルに登録
  // pkが日ごとに変わるデータ形式のため、putで上書きとする。
  var saveGrcRank = function( item ){
      var params = {
          TableName: "grc_rank",
          Item: {
              "pk": item.userid+"_"+item.domain+"_"+item.keyword+"_"+item.date+"_"+item.rank,
              "date":item.date,
              "rank":item.rank,
              "userid":item.userid,
              "domain":item.domain,
              "keyword":item.keyword,
              "name":item.name,
              "href":item.href,
              "summary":item.summary,
              "timestamp":item.timestamp
          }
      }
      console.log(params)
      dynamo.put(params, function (err, data) {
          if (err) {
              console.log(err, err.stack);
          } else {
              console.log(data);
          }
      });
  };
  */

  // Googleでkeywordを検索する。
  //
  var request = { q: encodeURIComponent(req.query.keyword) };
  var promise = searchClearlyByGoogle( request );

  // 検索結果を「タイトル」「URL」「概要」で表示する。
  //
  promise.then( function( result ){
      var list = result.clearlyList;
      var i, length = list.length;
      for( i=0; i<length; i++ ){
          console.log("---");
          console.log( list[i].domain );
          console.log( list[i].keyword );
          console.log( list[i].rank );
          console.log( list[i].title );
          console.log( list[i].url );
          console.log( list[i].description );
          console.log("");
          //saveGrcRank(list[i]);
      }
      return result;
  }).then(function( result ){
    res.send(result.clearlyList);
  }).catch(function(error){
    console.log(error);
  });

})

/*
app.get('/users', (req, res) => {
    var params = {
        TableName : "grc_user",
        Key: {
          'userid': req.query.userid
        }
    };
    dynamo.get(params, function(err, data) {
         if (err){
             console.log(err);
         } else {
             console.log(data);
             res.send(data);
         }
     });
})

//TOOD POST化
app.get('/saveusers', (req, res) => {
    //登録日
    var dt = new Date();
    var timestamp = dt.toFormat("YYYYMMDDHH24MISS");//YYYYMMDDHH24MISS

    console.log(req);
    var params = {
        TableName : "grc_user",
        Item: {
          "userid": req.query.userid,
          "domain_keyword":req.query.domain+"_"+req.query.keyword,
          "userstatus":"active",
          "timestamp":timestamp
        }
    };
    dynamo.put(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
            res.send(data);
        }
    });
})

app.get('/cheerio', (req, res) => {
    // Googleで「node.js」について検索する。
    var word = 'node.js';

    cheerioClient.fetch('http://www.google.com/search',{ q: word })
    .then(function (result) {
      var $ = result.$;
      // リンク一覧を表示
      $('a').each(function (idx) {
        console.log($(this).attr('href'));
      });
    })
    .catch(function (err) {
      console.log(err);
    })
    .finally(function () {
      // 処理完了でもエラーでも最終的に必ず実行される
      res.send("Hello cheerio")
    });
})

app.get('/dynamo', (req, res) => {
    var dynamo = new AWS.DynamoDB.DocumentClient();
    var param = {
        TableName : "grc_user",
        FilterExpression : "userid = :val",
        ExpressionAttributeValues : {":val" : "user0001"}
    };
    dynamo.scan(param, function(err, data) {
        if (err) {
            console.log("エラー = " + err);
            res.send(err);
        } else {
            console.log("成功 = " + data);
            res.send(data);
        }
    });
})

app.get('/users', (req, res) => {
    res.json(users)
})

app.get('/users/:userId', (req, res) => {
    const user = getUser(req.params.userId)

    if (!user) return res.status(404).json({})

    return res.json(user)
})

app.post('/users', (req, res) => {
    const user = {
        id: ++userIdCounter,
        name: req.body.name
    }
    users.push(user)
    res.status(201).json(user)
})

app.put('/users/:userId', (req, res) => {
    const user = getUser(req.params.userId)

    if (!user) return res.status(404).json({})

    user.name = req.body.name
    res.json(user)
})

app.delete('/users/:userId', (req, res) => {
    const userIndex = getUserIndex(req.params.userId)

    if(userIndex === -1) return res.status(404).json({})

    users.splice(userIndex, 1)
    res.json(users)
})

const getUser = (userId) => users.find(u => u.id === parseInt(userId))
const getUserIndex = (userId) => users.findIndex(u => u.id === parseInt(userId))

// Ephemeral in-memory data store
const users = [{
    id: 1,
    name: 'Joe'
}, {
    id: 2,
    name: 'Jane'
}]
let userIdCounter = users.length
*/

// The aws-serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)

// Export your express server so you can import it in the lambda function.
module.exports = app
