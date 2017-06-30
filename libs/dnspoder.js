/*
 *  DNSPoder By LancerComet at 21:20, 2016.06.15.
 *  # Carry Your World #
 */

const { version } = require('../package.json').version
const userAgent = `DnsPoder A Node.JS Client/${version} (chw644@hotmail.com)`

const http = require('http')
const https = require('https')
const qs = require('querystring')
const os = require('os')

const config = require('../config')
const commonParam = {
  login_token: config.token,
  format: 'json',
  lang: 'cn',
  error_on_empty: 'no'
}

module.exports = {
  getIP,
  getLocalIP,

  getRecordList,
  getRecordID,
  updateDDNS
}

/**
 * Get ip from remote.
 *
 * @returns
 */
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
	  	let res = ''
		  result.on('data', chunk => { res += chunk })
			result.on('end', () => resolve(res.match(ipRegexp)[0]))
		})
		request.end()
	})
}

/**
 * Get local ip address.
 *
 * @returns
 */
function getLocalIP () {
  const target = 'eth0'
  return new Promise(resolve => {
    const ip = os.networkInterfaces()[target][0].address
    resolve(ip)
  })
}

/**
 * 获取记录列表.
 *
 * @param {any} domain
 * @param {any} subDomain
 * @returns
 */
function getRecordList (domain, subDomain) {
  return new Promise((resolve, reject) => {
    const requestData = Object.assign({ domain }, commonParam)
    if (subDomain) { requestData.sub_domain = subDomain }

    postRequest({ path: '/Record.List', data: requestData }).then(result => {
      resolve(result)
    }).catch(error => {
      console.log('获取记录列表失败:')
      console.log(error)
      reject(error)
    })
  })
}

/**
 * 获取记录 ID.
 *
 * @param {any} domain
 * @param {any} subDomain
 * @returns
 */
function getRecordID (domain, subDomain) {
  return new Promise((resolve, reject) => {
    getRecordList(domain, subDomain).then(result => {
      const recordID = result.domain.id
      resolve(recordID)
    }).catch(error => {
      console.log('获取记录 ID 失败：')
      console.log(error)
      reject(error)
    })
  })
}

/**
 * Update ddns status.
 *
 * @param {any} domain
 * @param {any} recordID
 * @param {any} subDomain
 * @param {any} ip
 * @returns
 */
function updateDDNS (domain, recordID, subDomain, ip) {
  return new Promise((resolve, reject) => {
    const requestData = Object.assign({
      domain,
      record_id: recordID,
      record_line: '默认',
      value: ip
    }, commonParam)

    if (subDomain) {
      requestData.sub_domain = subDomain
    }

    postRequest({
      path: '/Record.Ddns',
      data: requestData
    }).then(result => {
      console.log(`更新 ${subDomain}.${domain} 成功: IP 地址现在指向 ${ip}.`)
      resolve(result)
    }).catch(error => {
      console.log(`更新 ${subDomain}.${domain} 失败:`)
      console.log(error)
      reject(error)
    })
  })
}

/**
 * Post request function.
 *
 * @param {{ path: string, data: {} }} params
 * @returns {Promise.<T>}
 */
function postRequest (params) {
  return new Promise((resolve, reject) => {
    const postData = qs.stringify(params.data)
    const request = https.request({
      host: 'dnsapi.cn',
      port: 443,
      path: params.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length,
        'User-Agent': userAgent
      },
    }, result => {
      result.setEncoding('utf-8')

      let res = ''

      result.on('data', chunk => { res += chunk })

      result.on('end', () => resolve(JSON.parse(res)))
    })

    request.on('error', err => {
      console.log(`Request Error: ${err}`)
      reject(err)
    })

    request.write(postData)
    request.end()
  })
}
