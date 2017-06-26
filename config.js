module.exports = {
  token: '',  // This is the TOKEN of your DNSPod account.
  domain: '',  // Example: "yourdomain.com"
  subname: '',  // Example: "app".  Then it will update "app.yourdomain.com".
  ip: '',  // Target IP Address. Example: "172.16.0.1". Dnspoder will get ip itself.
  interval: 1000 * 60 * 60  // Update interval.
}
