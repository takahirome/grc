var config = require('config');
var mysql      = require('mysql');
var connection = mysql.createConnection(config);


// CRUDのR
exports.read = function(req, res) {
    console.log("user.read");
    connection.query({
        sql: 'SELECT * FROM `user` WHERE `email` = ? AND `status` = "active"',
        timeout: 40000, // 40s
        values: [req.query.email]
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
    console.log("user.save");
    connection.query({
        sql: 'SELECT * FROM `user` WHERE `email` = ? AND `status` = "active"',
        timeout: 40000, // 40s
        values: [req.body.email]
    }, function (err, datas, fields) {
      if(err){
        console.log(err);
      }else if(datas ==null || datas.length==0){
        console.log("no data and INSERT");
        //INSERT
        connection.query('INSERT INTO `user` SET ?',{email:req.body.email,password:req.body.password},
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
        connection.query('UPDATE `user` set ? WHERE `id` = ?',[{email:req.body.email,password:req.body.password},datas[0].id],
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
    console.log("user.delete");
    connection.query({
        sql: 'SELECT * FROM `user` WHERE `email` = ? AND `status` = "active"',
        timeout: 40000, // 40s
        values: [req.body.email]
    }, function (err, datas, fields) {
      if(err){
        console.log(err);
      }else if(datas ==null || datas.length==0){
        console.log("no data");
      }else{
        //UPDATE
        console.log("DELETE (UPDATE status delete)");
        connection.query('UPDATE `user` set ? WHERE `id` = ?',[{status:'delete'},datas[0].id],
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
