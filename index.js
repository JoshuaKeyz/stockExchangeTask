const express = require('express');
const MongoClient = require('mongodb');
const cluster = require('cluster');
const os = require('os');
const assert = require('assert');
let StockExchangeLogic = require('./StockExchangeLogic')
let helpers = require('./helpers')




let numCpus = os.cpus().length;

let name = {}
if(os.platform() == "win32"){
    name.sing = "Thread";
    name.plur = "Threads"
    name.past = "Threaded";
}else{
    name.sing = "Process";
    name.plur = "Processes";
    name.past = "Processed"
}
//Multithread Workers based on the Number of CPUs on the Server for speed up purposes.

if(cluster.isMaster){
    console.log(`Multi${name.past} Server starting on ${numCpus} ${name.plur}`)
    for(let i = 0; i < numCpus; i++){
        cluster.fork();
        
    }
    cluster.on('death', (worker)=>{
        cluster.fork();
    })
}else{
    let app = express();
    let _db;
    let database = new MongoClient("mongodb://joshua_oguma:stockexchangetask@stockexchangecluster-shard-00-00-dwh9k.mongodb.net:27017,stockexchangecluster-shard-00-01-dwh9k.mongodb.net:27017,stockexchangecluster-shard-00-02-dwh9k.mongodb.net:27017/CompanySchema?ssl=true&replicaSet=StockExchangeCluster-shard-0&authSource=admin", (err, db)=>{
        try{
            assert.equal(null, err);
            console.log(`${name.sing} ${process.pid} Connected successfully to the StockExchange database servers`);
            app.listen(app.get('port'), ()=>{
                console.log(`${name.sing} ${process.pid} of Stock Exchange App listening at http://localhost/`);
            })
        }catch(e){
            if(e.constructor.name === "AssertionError"){
                console.log("Could not connect to the StockExchange Servers, please check your internet connection (and try again)");
                process.abort();
            }
        }
        _db = db;
        
    })
    
    app.use((req, res, next)=>{
        res.locals.db = _db;
        next();
    })
    
    app.set('port', (process.env.PORT || 80));
    
    app.get('/', (req, res)=>{
        console.log(`\n${name.sing} ${process.pid} is handling this request`);
        let db = res.locals.db;
        let unverifiedParams = req.query;
        //Write a test to make sure the params object contain necessary fields
        let verifiedParams = helpers.verify_url(unverifiedParams);
        if(verifiedParams.status == true){
            let logic = new StockExchangeLogic(db, verifiedParams.msg, res);
            logic.baseTarget().then((passed)=>{
                logic.budgetCheck(passed)
                //To reset the database for further testing use logic.resetDatabase();

            }).catch((err)=>{
                console.log(err.stack);
            })
        }else{
            res.send(verifiedParams.msg);
        }
        //res.send()
    
    })
}



