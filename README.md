# dnspoder
A simple Node.JS client for DNSPod.

Please note that this is almost designed for Chinese people. All the console outputs are CHS. 

## Usage
  1. git clone.
  2. Setup your domain and account in "app.js".
  
  ```
    const domainConfig = {
        domain: "",  // Example: "yourdomain.com"
        subname: "",  // Example: "app".  Then it will update "app.yourdomain.com".
        ip: "",  // Target IP Address. Example: "172.16.0.1"
                 // Please find another way to acquire your ip address.
        interval: 1000 * 60 * 5  // Update interval.
    };
  ```
  3. `node app`
  4. Done.
  
Check source files for more detail.

## License.
MIT @ LancerComet.
