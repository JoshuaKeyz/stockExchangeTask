const fs = require('fs');
const assert = require('assert');

class LoggingService{
    constructor(){
        fs.access("./logs/", fs.constants.F_OK | fs.constants.W_OK | fs.constants.R_OK, (err)=>{
            try{
                assert.equal(err, null);
                //Folder exists
            }catch(e){
                //Folder doesn't exist
                fs.mkdir("./logs", (err)=>{
                    try{
                        assert.equal(err, null);
                    }catch(e){
                        console.log("Could not create Directory ", e.message);
                    }
                })
            }
        })
    }
    log(data){
       fs.appendFile("./logs/logs.txt", `${data}` , {encoding: "utf8"}, (err)=>{
           try{
               assert.equal(err, null)
           }catch(e){
                console.log("Error Occurred during log() operation on class LoggingService{}", e.message);
           }
       })
    }
    viewLogs(){
        fs.readFile("./logs/logs.txt", {encoding :"utf8", flag: "r"}, (err, data)=>{
            try{
                assert.equal(err, null);
                if(data.length < 1){
                    console.log("No Logs yet");
                }else{
                    console.log(data);
                }
            }catch(e){
                console.log("Error Occurred during viewLogs() on class LoggingService{}", e.message);
            }
        })
    }

    //Extra Administrative Method for clearing the log file
    clearLogs(){
        fs.writeFile("./logs/logs.txt", "", (err)=>{
            try{
                assert.equal(err, null);
                console.log("Logs Cleared");
            }catch(e){
                console.log("Error Occurred during clearLogs() on class LoggingService{}", e.message);
            }
        })
    }
}

//Exports a singleton instance to the system for handling Logging operations;
let instance = new LoggingService();
module.exports = instance;
    
    //TODO:: Write Unit Tests based on this
    /*logger.viewLogs();
    logger.clearLogs();
    logger.viewLogs();*/
