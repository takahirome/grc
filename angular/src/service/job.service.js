var request = require('request');
var jconv = require('jconv');

// CRUDのR
exports.job = function(req, res) {

    console.log("JOB START");
    callStocks()
    .then(function(callStocksResults){
        callStocksResultsJson = JSON.parse(callStocksResults);
        const callScrapeResults = { scrape:[] };
        // asyncFunc関数に渡してたジェネレータを、async関数にする
        (async ()=>{
            // 60回Promiseを待機する。
            // rejectされた時は、自動的にこの関数が中断されるからtry-catchで囲む必要もない。
            for(var i=0;i<callStocksResultsJson.length;i++){
                // awaitで同期処理
                const callScrapeResult = await callScrape(callStocksResultsJson[i].domain,encodeURIComponent(jconv.convert(callStocksResultsJson[i].keyword,'UTF8','JIS')));
                process.on('unhandledRejection', console.dir);
                if(callScrapeResult === "") break;
                csrjson = JSON.parse(callScrapeResult);
                for(var n=0;n<csrjson.length;n++){
                    callScrapeResults.scrape.push(csrjson[n]);
                }
            }
            // for文を無事抜けたら成功したことを意味する
            return callScrapeResults; // 硬派な書き方が好きな人は「return Promise.resolve(dataList);」            
        })().then((callScrapeResults)=>{
            const saveRankResults = [];
             
            // asyncFunc関数に渡してたジェネレータを、async関数にする
            (async ()=>{
                // 60回Promiseを待機する。
                // rejectされた時は、自動的にこの関数が中断されるからtry-catchで囲む必要もない。
                for(var j=0;j<callScrapeResults.scrape.length;j++){
                    // awaitで同期処理
                    const saveRankResult = await saveRank(callScrapeResults.scrape[j].domain,
                                    callScrapeResults.scrape[j].keyword,
                                    callScrapeResults.scrape[j].rank,
                                    callScrapeResults.scrape[j].title,
                                    callScrapeResults.scrape[j].url,
                                    callScrapeResults.scrape[j].description);
                    process.on('unhandledRejection', console.dir);
                    if(saveRankResult === "") break;
                    saveRankResults.push(saveRankResult);
                }
                return saveRankResults
            })().then((saveRankResults)=>{
                // 全てresolveが呼ばれた場合、この関数が実行される
                console.log("子全部成功したよ！");
            }).catch(function(err){
                // 途中1回でもreject関数が呼ばれた場合、この関数が実行される
                console.log("子途中で失敗したみたい…");
                console.log(err);
            });                
        }).then(function(){
            // 全てresolveが呼ばれた場合、この関数が実行される
            console.log("親全部成功したよ！");
            res.send(200);
        }).catch(function(err){
            // 途中1回でもreject関数が呼ばれた場合、この関数が実行される
            console.log("親途中で失敗したみたい…");
            console.log(err);
        });
    }).then(function(err){
    });
};

function callStocks(){
    console.log("job.callStocks");
    return new Promise(function (resolve, reject) {
        // request options
        var options = {
            url: 'http://52.197.191.39/stocks',
            method: 'GET'
        };
        request(options, function (err, response, body) {
            if (body) {
                // console.log(body);
                resolve(body);
            }
            if (err) {
                console.log(err);
                reject(err);
            }
        });
    });
}

function callScrape(domain,keyword){
    console.log("job.callScrape");
    return new Promise(function (resolve, reject) {
        // request options
        var options = {
            url: 'https://w5whasqpwg.execute-api.ap-northeast-1.amazonaws.com/prod/scrape/?domain='+domain+'&keyword='+keyword,
            method: 'GET'
        };
        request(options, function (err, response, body) {
            if (body) {
                // console.log(body);
                resolve(body);
            }
            if (err) {
                console.log(err);
                reject(err);
            }
        });
    });
}

function saveRank(domain,keyword,rank,title,url,description){
    console.log("job.saveRank");
    return new Promise(function (resolve, reject) {
        // HTTP header
        var headers = {
            'Content-Type': 'application/json',
        };
        // request options
        var options = {
            url: 'http://52.197.191.39/rank',
            method: 'POST',
            headers: headers,
            json:{
                'domain':domain,
                'keyword':keyword,
                'rank':rank,
                'title':title,
                'url':url,
                'description':description
            }
        };
        request(options, function (err, response, body) {
            if (body) {
                // console.log(body);
                resolve(body);
            }
            if (err) {
                console.log(err);
                reject(err);
            }
        });
    });
}