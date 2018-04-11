let logger = require('./LoggingService')
let helpers = require('./helpers')

class StockExchangeLogic{
    constructor(db, params, res){
        this.db = db;
        this.params = params;
        this.res = res;     //For sending response to the clients
    }
    static getParams(){
        return this.params;
    }
    
    baseTarget(){
        let passed = null;
        let failed = null;
        let passed_arr = null;
        return new Promise((resolve, reject)=>{
            this.db.collection('companystocks').find({"Countries": this.params.countrycode.toUpperCase(), "Category": this.params.category.toUpperCase()}, {_id: 0}).toArray((err, docs_passed)=>{
                if(!err){
                    if(docs_passed.length >= 1){
                        passed = helpers.output_baseTarget_pass(docs_passed).str_version;
                        passed_arr = helpers.output_baseTarget_pass(docs_passed).arr_version;
                        this.db.collection('companystocks').find({$or: [{"Countries": {$ne : this.params.countrycode.toUpperCase()}}, 
                            {"Category": {$ne: this.params.category.toUpperCase()}}]}, {_id: 0}).toArray((err, docs_failed)=>{

                            if(!err){
                                failed = helpers.output_baseTarget_failed(docs_failed).str_version;
                                console.log(`BaseTargeting: ${passed.concat(failed)}`);
                                logger.log(`BaseTargeting: ${passed.concat(failed)}\n`);
                                let passed_resolution = {
                                    documents: docs_passed,
                                    parameters: this.params,
                                    comp_passed: passed_arr
                                }
                                resolve(passed_resolution);
                            }else{
                                reject(err);
                            }
                            
                        })
                    }else{
                        this.res.send("No Companies passed from Targetting")
                        logger.log("\n")
                    }
                }else{
                    console.log("Error");
                    reject(err);
                }
            })
        })        
    }
    budgetCheck(obj){
        if(obj.documents.length >= 1){
            let newarr = helpers.output_budget_test(obj.documents);
            let passed_str = newarr.passed_str_version;
            let passed_arr = newarr.passed_arr_version;
            let failed_str = newarr.failed_str_version;
            let failed_arr = newarr.failed_arr_version;

            console.log(`BudgetCheck: ${passed_str.concat(failed_str)}`)
            logger.log(`BudgetCheck: ${passed_str.concat(failed_str)}\n`);
            this.bidCheck(newarr);
        }else{
            this.res.send("No Companies passed from BudgetCheck");
            logger.log("\n")
        }      
    }
    bidCheck(obj){
        let bidTest = helpers.output_bid_test(obj.documents, this.params);
        if(bidTest.documents.length >= 1){
            let passed_str = bidTest.passed_str_version;
            let passed_arr = bidTest.passed_arr_version;
            let failed_str = bidTest.failed_str_version;
            let failed_arr = bidTest.failed_arr_version;

            console.log(`BidCheck: ${passed_str.concat(failed_str)}`)
            logger.log(`BidCheck: ${passed_str.concat(failed_str)}\n`)
            this.shortList(bidTest);
        }else{
            this.res.send("No Companies passed from BidCheck")
            logger.log("\n")
        }        
    }
    shortList(obj){
        let docs = obj.documents;
        if(docs.length > 1){
            let winner = docs.reduce((a, b)=>{
                if(a["Bid"] > b["Bid"]){
                    return a;
                }else{
                    return b;
                }
            })
            this.res.send(`response = ${winner["CompanyID"]}`)
            logger.log(`Winner = ${winner["CompanyID"]}\n\n`)
            console.log(`Winner = ${winner["CompanyID"]}`)
            this.reduceBudget(winner);
        }else{
            this.res.send(`response = ${docs[0]["CompanyID"]}`)
            logger.log(`Winner = ${docs[0]["CompanyID"]}\n\n`)
            console.log(`Winner = ${docs[0]["CompanyID"]}`)
            this.reduceBudget(docs[0]);
        }
        
    }
    reduceBudget(doc){
        let newBudget = doc.Budget - doc.Bid;
        this.db.collection('companystocks').updateOne({"CompanyID": doc.CompanyID}, {$set:{"Budget": newBudget}}, (err, result)=>{
            if(!err){
                console.log("done");
                this.dbScreenShot();
            }
        })
    }
    resetDataBase(){
        this.db.collection('companystocks').deleteMany({}, (err, results)=>{
            if(!err){
                this.db.collection('companystocks').insertMany([
                    {
                        "CompanyID": "C1",
                        "Countries": ["US", "FR"],
                        "Budget": 100,
                        "Bid": 10,
                        "Category": ["AUTOMOBILE", "FINANCE"]
                    },
                    {
                        "CompanyID": "C2",
                        "Countries": ["IN", "US"],
                        "Budget": 200,
                        "Bid": 30,
                        "Category": ["FINANCE", "IT"]
                    },
                    {
                        "CompanyID": "C3",
                        "Countries": ["US", "RU"],
                        "Budget": 300,
                        "Bid": 5,
                        "Category": ["IT", "AUTOMOBILE"]
                    }
                ], (err, res)=>{
                    if(!err){
                        console.log("Database Refreshed");
                    }
                })
            }else{
                console.log(err);
            }
        });
    }
    dbScreenShot(){
        this.db.collection('companystocks').find({}, {_id: 0}).toArray((err, docs)=>{
            if(!err){
                docs.forEach((doc)=>{
                    console.log(doc);
                })
            }
        })
    }
}
module.exports = StockExchangeLogic;