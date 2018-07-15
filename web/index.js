'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const zmq = require('zeromq');
const nconf = require('nconf');
const bodyParser = require('body-parser');

const scraper_push = zmq.socket('push');
const scraper_pull = zmq.socket('pull');

nconf.argv()
    .env()
    .file(path.join(__dirname, '.env.local'))
    .defaults({
        port: 8000,
        host: '127.0.0.1'
    });

if(!nconf.get('web_sock') || !nconf.get('scraper_sock')) {
    console.log('Error. Your wallet password is not set');
    process.exit();
}

scraper_push.connect(nconf.get('web_sock'));
scraper_pull.bindSync(nconf.get('scraper_sock'));

const app = express();
const server = http.createServer(app);

app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('ewr');
//    res.render('index.html');
});

app.post('/api/screen', (req, res) => {
    //todo check if valid url
    scraper_push.send({
        url: req.body.url
    });
});

app.use((req, res) => {
    res.status(404);
    res.send('404. Page does not exist');
});

server.listen(nconf.get('port'), nconf.get('host'), () => {
    console.log('start host: '+ nconf.get('host') + ' port: ' + nconf.get('port'));
});

