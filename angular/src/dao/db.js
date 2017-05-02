var aws = require('aws-sdk');
aws.config.loadFromPath('/home/ec2-user/aws/config.json');
var db = new aws.DynamoDB.DocumentClient();

// CRUDのC
exports.create = function(req, res) {
  var content = JSON.parse(req.body.mydata);
  Db.connect(mongoUri, function(err, db) {
    db.collection('todolist', function(err, collection) {
      collection.insert(content, {safe: true}, function(err, result) {
        res.send();
        db.close();
      });
    });
  });
};

// CRUDのR
exports.read = function(req, res) {

    var param = {
        TableName : "grc_rank",
        FilterExpression : "userid = :val",
        ExpressionAttributeValues : {":val" : "user0001"}
    };

    db.scan(param, function (err, datas) {
        if(err){
            console.log(error);
        }else if(datas ==null || datas.Count==0){
            console.log("no data");
        }else{
            console.log(JSON.stringify(datas));
            res.send(datas);
        }
    });
};

// CRUDのU
exports.update = function(req, res) {
  var content = JSON.parse(req.body.mydata);
  var updatedata = {};
  updatedata.data = content.data;
  updatedata.checked = content.checked;
  var id = req.params.id;

  Db.connect(mongoUri, function(err, db) {
    db.collection('todolist', function(err, collection) {
      collection.update({'_id':new BSON.ObjectID(id)}, updatedata, {upsert:true}, function(err, result) {
        res.send();
        db.close();
      });
    });
  });
};

// CRUDのD
exports.delete = function(req, res) {
  var id = req.params.id;
  console.log(id);

  Db.connect(mongoUri, function(err, db) { // add Db.connect
    db.collection('todolist', function(err, collection) {
      collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
        res.send();
        db.close();
      });
    });
  });
};