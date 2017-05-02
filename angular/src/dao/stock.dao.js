var config = require('config');
var mysql      = require('mysql');
var connection = mysql.createConnection(config);


// CRUDのR
exports.read = function(req, res) {
    console.log("stock.read");
    connection.query({
        sql: 'SELECT * FROM `stock` WHERE `userid` = ? AND `status` = "active"',
        timeout: 40000, // 40s
        values: [req.query.userid]
    }, function (err, datas, fields) {
      if(err){
          console.log(err);
      }else if(datas ==null || datas.length==0){
          console.log("no data");
      }else{
//          console.log(datas);
          res.send(datas);
      }
    });
};

// CRUDのR
exports.readall = function(req, res) {
    console.log("stock.readall");
    connection.query({
        sql: 'SELECT * FROM `stock` WHERE `status` = "active"',
        timeout: 40000 // 40s
    }, function (err, datas, fields) {
      if(err){
          console.log(err);
      }else if(datas ==null || datas.length==0){
          console.log("no data");
      }else{
//          console.log(datas);
          res.send(datas);
      }
    });
};

// CRUDのCU
exports.save = function(req, res) {
    console.log("stock.save");
    connection.query({
        sql: 'SELECT * FROM `stock` WHERE `userid` = ? AND `domain` = ? AND `keyword` = ? AND `status` = "active"',
        timeout: 40000, // 40s
        values: [req.body.userid,req.body.domain,req.body.keyword]
    }, function (err, datas, fields) {
      if(err){
        console.log(err);
      }else if(datas ==null || datas.length==0){
        console.log("no data and INSERT");
        //INSERT
        connection.query('INSERT INTO `stock` SET ?',{userid:req.body.userid,domain:req.body.domain,keyword:req.body.keyword},
        function (err, datas, fields) {
            if(err){
                console.log(err);
            }else{
                // console.log(datas);
                res.send(datas);
            }
        });
      }else{
        //UPDATE
        console.log("UPDATE:"+datas[0].id);
        connection.query('UPDATE `stock` set ? WHERE `id` = ?',[{userid:req.body.userid,domain:req.body.domain,keyword:req.body.keyword},datas[0].id],
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

// CRUDのD
exports.delete = function(req, res) {
    console.log("stock.delete");
    connection.query({
        sql: 'SELECT * FROM `stock` WHERE `userid` = ? AND `domain` = ? AND `keyword` = ? AND `status` = "active"',
        timeout: 40000, // 40s
        values: [req.body.userid,req.body.domain,req.body.keyword]
    }, function (err, datas, fields) {
      if(err){
        console.log(err);
      }else if(datas ==null || datas.length==0){
        console.log("no data");
      }else{
        //UPDATE
        console.log("DELETE (UPDATE status delete)");
        connection.query('UPDATE `stock` set ? WHERE `id` = ?',[{status:'delete'},datas[0].id],
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
