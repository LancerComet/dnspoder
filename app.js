/**
 * DNSPoder is a dnspod client written in JavaScript.
 * By LancerComet at 21:20, 2016.06.15.
 * # Carry Your World #
 *
 * @author LancerComet
 * @license MIT
 */

const config = require('./config')
const dnspoder = require("./libs/dnspoder")

if (!config.ip) {
  // You can use either getIP() or getLocalIP() to accquire your IP.
  dnspoder.getIP().then(ip => {
    config.ip = ip
    update()
  }).catch(error => {
    console.error('[Dnspoder Error] Failed to get ip, dnspoder existed.')
    console.error(error)
    process.exit(1)
  })
} else {
  update()
}

function update () {
  dnspoder.getRecordID(config.domain, config.subname).then(recordID =>
      dnspoder.updateDDNS(config.domain, recordID, config.subname, config.ip)
        .then(() => setTimeout(update, config.interval))
    )
}
