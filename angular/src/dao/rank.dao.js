var config = require('config');
var mysql      = require('mysql');
var connection = mysql.createConnection(config);
require('date-utils');

// CRUDのR
exports.read = function(req, res) {
    console.log("rank.read");
    connection.query({
        sql: 'SELECT * FROM `rank` WHERE `domain` = ? AND `keyword` = ? AND `status` = "active"',
        timeout: 40000, // 40s
        values: [req.query.domain,req.query.keyword]
    }, function (err, datas, fields) {
      if(err){
          console.log(err);
      }else if(datas ==null || datas.length==0){
          console.log("no data");
      }else{
        //   console.log(datas);
          res.send(datas);
      }
    });
};

// CRUDのR
exports.readall = function(req, res) {
    console.log("rank.readall");
    connection.query({
        sql: 'SELECT * FROM `rank` WHERE `status` = "active"',
        timeout: 40000 // 40s
    }, function (err, datas, fields) {
      if(err){
          console.log(err);
      }else if(datas ==null || datas.length==0){
          console.log("no data");
      }else{
        //   console.log(datas);
          res.send(datas);
      }
    });
};

// CRUDのCU
exports.save = function(req, res) {
    console.log("rank.save");
    var dt = new Date();
    var yyyymmdd = dt.toFormat("YYYY-MM-DD");
    var from = yyyymmdd+" 00:00:00";
    var to = yyyymmdd+" 23:59:59"

    connection.query({
        sql: 'SELECT * FROM `rank` WHERE `domain` = ? AND `keyword` = ? AND `rank` = ? AND `status` = "active" AND timestamp BETWEEN ? AND ? ',
        timeout: 40000, // 40s
        values: [req.body.domain,req.body.keyword,req.body.rank,from,to]
    }, function (err, datas, fields) {
      if(err){
        console.log(err);
      }else if(datas ==null || datas.length==0){
        console.log("no data and INSERT");
        //INSERT
        connection.query('INSERT INTO `rank` SET ?',{domain:req.body.domain,keyword:req.body.keyword,rank:req.body.rank,title:req.body.title,url:req.body.url,description:req.body.description},
        function (err, datas, fields) {
            if(err){
                console.log(err);
            }else{
//                console.log(datas);
                res.send(datas);
            }
        });
      }else{
        //UPDATE
        console.log("UPDATE:"+datas[0].id);
        connection.query('UPDATE `rank` set ? WHERE `id` = ?',[{domain:req.body.domain,keyword:req.body.keyword,rank:req.body.rank,title:req.body.title,url:req.body.url,description:req.body.description},datas[0].id],
        function (err, datas, fields) {
            if(err){
                console.log(err);
            }else{ 
                // console.log(datas);
                res.send(datas);
            }
        });
      }
    });    
};
