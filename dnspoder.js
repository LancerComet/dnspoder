/*
 *  DNSPoder By LancerComet at 21:20, 2016.06.15.
 *  # Carry Your World # 
 */

const https = require("https"),
    qs = require("querystring"),
    userAgent = "DnsPoder A Node.JS Client/1.0.0 (chw644@hotmail.com)",
    commonParam = {
        login_token: global.TOKEN,
        format: "json",
        lang: "cn",
        error_on_empty: "no"
    };


module.exports = {
    getRecordList: getRecordList,
    getRecordID: getRecordID,
    updateDDNS: updateDDNS
};


// 获取记录列表.
function getRecordList (domain, subDomain) {
    return new Promise((resolve, reject) => {
        var requestObj = copyObj(commonParam);
        requestObj.domain = domain;
        if (subDomain) {
            requestObj.sub_domain = subDomain;
        }
        postRequest({ path: "/Record.List", data: requestObj })
            .then(result => {
                resolve(result);
            }, error => {
                console.log("获取记录列表失败:")
                console.log(error);
                reject(error)
            });
    });
}

// 获取记录 ID.
function getRecordID (domain, subDomain) {
    return new Promise((resolve, reject) => {
        getRecordList(domain, subDomain).then(function (result) {
            const recordID = result.records[0].id;
            resolve(recordID);
        }, function (error) {
            console.log("获取记录 ID 失败：");
            console.log(error);
            reject(error);
        });
    })
}

// 更新 DDNS.
function updateDDNS (domain, recordID, subDomain, ip) {
    return new Promise((resolve, reject) => {
        var requestObj = copyObj(commonParam);
        requestObj.domain = domain;
        requestObj.record_id = recordID;
        requestObj.sub_domain = subDomain;
        requestObj.record_line = "默认";
        requestObj.value = ip;

        postRequest({
            path: "/Record.Ddns",
            data: requestObj
        }).then(function (result) {
            console.log(`更新 ${subDomain}.${domain} 成功: IP 地址现在指向 ${ip}.`);
            resolve(result);
        }, function (error) {
            console.log(`更新 ${subDomain}.${domain} 失败:`);
            console.log(error);
            reject(error);
        });
    });
}  


// POST 请求.
function postRequest (params) {
    /*
     *  @ params: {
     *      path: String,
     *      data: Object
     *  }
     */
    return new Promise((resolve, reject) => {
        var postData = qs.stringify(params.data);

        var request = https.request({
            host: "dnsapi.cn",
            port: 443,
            path: params.path,
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": postData.length,            
                "User-Agent": userAgent
            },
        }, (result) => {
            result.setEncoding("utf-8");
            
            var res = "";
            result.on("data", function (chunk) {
                res += chunk;
            });

            result.on("end", function () {
                resolve(JSON.parse(res));
            });
        });

        request.on("error", err => {
            console.log(`Request Error: ${err}`);
            reject(err);            
        });

        request.write(postData);

        request.end();
    });
}


function copyObj (source) {
    var result = {};
    for (var i in source) {
        result[i] = source[i]
    };
    return result;
}