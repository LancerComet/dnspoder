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
  interval: 1000 * 60 * 60  // Update interval.
};

getIP().then(ip => {
  domainConfig.ip = ip
  setInterval(updateDDNS, domainConfig.interval)
	updateDDNS()
})


function updateDDNS () {
  dnspoder.getRecordID(domainConfig.domain, domainConfig.subname).then(function (recordID) {
    dnspoder.updateDDNS(domainConfig.domain, recordID, domainConfig.subname, domainConfig.ip).then(result => {
      // Succeed.
    }, error => {
      // Failed.
    });
  });
}

function getIP () {
	const ipRegexp = /(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)/
  return new Promise((resolve, reject) => {
    const request = http.request({
	    host: '1212.ip138.com',
	    port: 80,
	    path: '/ic.asp',
	    method: 'GET'
	  }, result => {
	    result.setEncoding('utf-8')
	  	let res = ""
		  result.on("data", function (chunk) { res += chunk })
			result.on("end", function () {
				resolve(res.match(ipRegexp)[0])
			})
		})

		request.end()
	})
}
