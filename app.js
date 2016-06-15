/*
 *  DNSPoder By LancerComet at 21:20, 2016.06.15.
 *  # Carry Your World # 
 */

global.TOKEN = "";  // This is the TOKEN of your DNSPod account.
const http = require("http");
const dnspoder = require("./dnspoder")

const domainConfig = {
    domain: "",  // Example: "yourdomain.com"
    subname: "",  // Example: "app".  Then it will update "app.yourdomain.com".
    ip: "",  // Target IP Address. Example: "172.16.0.1"
             // Please find another way to acquire your ip address.
    interval: 1000 * 60 * 5  // Update interval.
};

setInterval(updateDDNS, domainConfig.interval);
updateDDNS();
function updateDDNS () {
    dnspoder.getRecordID(domainConfig.domain, domainConfig.subname).then(function (recordID) {
        dnspoder.updateDDNS(domainConfig.domain, recordID, domainConfig.subname, result.ip).then(result => {
            // Succeed.
        }, error => {
            // Failed.
        });
    });
}