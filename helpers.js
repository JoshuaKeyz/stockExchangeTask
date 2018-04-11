class Helpers{
    constructor(){};
    output_baseTarget_pass(arr){
        let passed_str = arr.map(value=>`{${value["CompanyID"]}, Passed}`);
        let passed_arr = arr.map(value=>value["CompanyID"]);
        return {"str_version": passed_str, "arr_version": passed_arr};
    }
    output_baseTarget_failed(arr){
        let failed_str = arr.map(value=>`{${value["CompanyID"]}, Failed}`)//`{${value["CompanyID"]}, Failed}`);
        let failed_arr = arr.map(value=>value["CompanyID"])
        return {"str_version": failed_str, "arr_version": failed_arr};
    }
    //

        //Add to the documentation why it is necessary to use four functions for these tasks.
        //This is because the API passes explicitly passed collections to the next test, and not 
        //a mixture of passes and fails



    output_budget_test(arr){
        //If budget is less than the Bid, then the company doesn't have anymore stocks to exchange
        let failed_str = [];
        let failed_arr = [];
        let passed_str = [];
        let passed_arr = [];
        let refined_doc = [];
        for(let i = 0; i < arr.length; i++){
            let budget = arr[i]["Budget"];
            let bid = arr[i]["Bid"];
            if(budget < bid){
                failed_str.push(`{${arr[i]["CompanyID"]}, Failed}`);
                failed_arr.push(arr[i]["CompanyID"]);
            }else if(budget >= bid){
                passed_str.push(`{${arr[i]["CompanyID"]}, Passed}`);
                passed_arr.push(arr[i]["CompanyID"]);
                refined_doc.push(arr[i])
            }
        }
        return {
            "passed_str_version": passed_str, 
            "passed_arr_version": passed_arr, 
            "failed_str_version": failed_str, 
            "failed_arr_version": failed_arr,
            "documents": refined_doc
        };
    }
    output_bid_test(arr, params){
        let failed_str = [];
        let failed_arr = [];
        let passed_str = [];
        let passed_arr = [];
        let refined_doc = [];
        for(let i = 0; i < arr.length; i++){
            if(arr[i]["Bid"] >= params.basebid){
                refined_doc.push(arr[i]);
                passed_str.push(`{${arr[i]["CompanyID"]}, Passed}`);
                passed_arr.push(arr[i]["CompanyID"]);
            }else if(arr[i]["Bid"] < params.basebid){
                failed_str.push(`{${arr[i]["CompanyID"]}, Failed}`);
                failed_arr.push(arr[i]["CompanyID"]);
            }
        }
        return {
            "passed_str_version": passed_str, 
            "passed_arr_version": passed_arr, 
            "failed_str_version": failed_str, 
            "failed_arr_version": failed_arr,
            "documents": refined_doc
        };
    }
    verify_url(url){
        let ensureFieldsArePresent = function(url){
            if('countrycode' in url){
                if('category' in url){
                    if('basebid' in url){
                        return "";
                    }else{
                         return `UrL Error: no (or incorrect) basebid identifier in your url: Your url should follow this syntax:\n[server_address]/?countrycode=[value]&category=[value]&basebid=[value]\n`;   
                    }
                }else{
                    return `UrL Error: no (or incorrect) category identifier in your url: Your url should follow this syntax:\n[server_address]/?countrycode=[value]&category=[value]&basebid=[value]\n`;
                }
            }else{
                return `URL Error: no (or incorrect) countrycode identifier in your url: Your url should follow this syntax:\n[server_address]/?countrycode=[value]&category=[value]&basebid=[value]`;
            }
        }
        
        //this function makes sure all values to be inserted into the MongoDB Database are strings and not objects
        let preventInjectionAttacks = function(url){
            for(field in url){
                url[field] = url[field].toString();
            }
            return url;
        }
        //Ideally, url should be a JSON Object, as the req.query returns a JSON object

        //Convert all the fields in the URL to lowercase
    
        //Step 1: Making sure all the fields are in lower case
        let temp = JSON.stringify(url).toLowerCase();
        url = JSON.parse(temp);

        //Step 2: Making sure the API input contains the fields and that all value types are strings and not objects
        //  i: countrycode
        // ii: category
        //iii: basebid

        let validate = ensureFieldsArePresent(url)
        if( validate === ""){
            //Sanitize the values to strings
            //preventInjectionAttacks(url)
            return {status: true, msg: url}
        }else{
            return {status: false, msg: validate};
        }
    }

    
}

module.exports = new Helpers();