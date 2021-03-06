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
var jconv = require('jconv');

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
                    "keyword": jconv.decode(req.query.keyword,'JIS'),
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

  // Googleでkeywordを検索する。
  //
  var query = jconv.decode(req.query.keyword,'JIS');
  var request = { q: query };
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


// The aws-serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)

// Export your express server so you can import it in the lambda function.
module.exports = app
