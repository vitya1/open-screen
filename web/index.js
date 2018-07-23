'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const zmq = require('zeromq');
const nconf = require('nconf');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Screen = require('./models/screen');

nconf.argv()
    .env()
    .file(path.join(__dirname, '.env.local'))
    .defaults({
        port: 8000,
        host: '127.0.0.1'
    });

mongoose.connect(nconf.get('mongo_address'));

const scraper_push = zmq.socket('push');
const scraper_pull = zmq.socket('pull');

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

app.get('/api/screen/add', (req, res) => {
    const name = randomatic('aA0', 12);
    const shot = new Screen({
        hash: name,
        url: req.body.url,
        creation_date: Date.now(),
        creator_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });
    shot.save().then(() => console.log('screen saved'));

    //todo check if valid url
    scraper_push.send({
        name: name,
        url: req.body.url
    });

    res.status(200).send({
        error: false,
        id: name
    });
});

app.get('/api/screen', (req, res) => {
    Person.findOne({'hash': req.body.hash}, (err, screenshot) => {
        if (err)  {
            res.status(404);
            res.send('404. Page does not exist');
            return false;
        }
        res.status(200).send({
            error: false,
            data: screenshot
        });
    });
});

scraper_pull.on('message', async (msg) => {
    let data = JSON.parse(msg.toString());
    if(!data.url) {
        console.log('Error. Message must have url property');
        return;
    }
    console.log('Scraping result', result);
});

app.use((req, res) => {
    res.status(404);
    res.send('404. Page does not exist');
});

server.listen(nconf.get('port'), nconf.get('host'), () => {
    console.log('start host: '+ nconf.get('host') + ' port: ' + nconf.get('port'));
});

