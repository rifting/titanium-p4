/***************
 * node-unblocker: Web Proxy for evading firewalls and content filters,
 * similar to CGIProxy or PHProxy
 *
 *
 * This project is hosted on github:  https://github.com/nfriedly/nodeunblocker.com
 *
 * By Nathan Friedly - http://nfriedly.com
 * Released under the terms of the Affero GPL v3
 */

var url = require('url');
var querystring = require('querystring');
var express = require('express');
var http = require('http');

var app = express();

var server = http.createServer(app);

async function start() {
    var wispModule = await import('@mercuryworkshop/wisp-js/server');
    var scramjetModule = await import('@mercuryworkshop/scramjet/path');
    var libcurlModule = await import('@mercuryworkshop/libcurl-transport');
    var baremuxModule = await import('@mercuryworkshop/bare-mux/node');

    wispModule.logging.set_level(wispModule.logging.NONE);
    Object.assign(wispModule.server.options, {
        allow_udp_streams: false,
        dns_servers: ['1.1.1.3', '1.0.0.3']
    });

    app.use('/scram', express.static(scramjetModule.scramjetPath));
    app.use('/libcurl', express.static(libcurlModule.libcurlPath));
    app.use('/baremux', express.static(baremuxModule.baremuxPath));
    app.use('/', express.static(__dirname + '/public'));

    server.on('upgrade', function (req, socket, head) {
        if (req.url.endsWith('/wisp/')) {
            wispModule.server.routeRequest(req, socket, head);
        } else {
            socket.end();
        }
    });

    var port = parseInt(process.env.PORT || '8080', 10);
    server.listen(isNaN(port) ? 8080 : port, '0.0.0.0', function () {
        console.log('Titanium P4 listening on port ' + (isNaN(port) ? 8080 : port));
    });
}

// this is for users who's form actually submitted due to JS being disabled or whatever
app.get("/no-js", function(req, res) {
    // grab the "url" parameter from the querystring
    var site = querystring.parse(url.parse(req.url).query).url;
    res.redirect('/edu/' + site);
});

module.exports = app;

start().catch(function (error) {
    console.error(error);
    process.exitCode = 1;
});
