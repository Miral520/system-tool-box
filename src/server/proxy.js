const http = require('http');
const superAgent = require('superagent');
const url = require('url');

http.createServer((req, res) => {
    var params = url.parse(req.url, true).query;
    var proxy_url = params.url.replace(/\$/g, '&');
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8888');
    var sreq = superAgent.get(proxy_url);
    sreq.pipe(res);
    sreq.on('end', () => {
        console.log('done');
    });
}).listen(3000);