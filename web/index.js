'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const zmq = require('zeromq');
const nconf = require('nconf');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const randomatic = require('randomatic');
const Screen = require('./models/screen');

nconf.argv()
    .env()
    .file(path.join(__dirname, '.env.local'))
    .defaults({
        port: 9000,
        host: '127.0.0.1'
    });

mongoose.connect(nconf.get('mongo_address'), {useNewUrlParser: true});

const scraper_push = zmq.socket('push');
const scraper_pull = zmq.socket('pull');

if(!nconf.get('web_sock') || !nconf.get('scraper_sock')) {
    console.log('Error. Your wallet password is not set');
    process.exit();
}

console.log('Push sock', nconf.get('scraper_sock'));
scraper_push.connect(nconf.get('scraper_sock'));
scraper_pull.bindSync(nconf.get('web_sock'));

const app = express();
const server = http.createServer(app);

app.use(express.static(__dirname + '/public/'));
app.use('/storage', express.static(path.join(__dirname, '../storage/')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('ewr');
//    res.render('index.html');
});

app.post('/api/screen/add', (req, res) => {
    const name = randomatic('aA0', 12);

    //@todo check if valid url
    scraper_push.send(JSON.stringify({
        name: name,
        url: req.body.url
    }));

    //@todo move to socket io
    scraper_pull.on('message', async (msg) => {
        let data = JSON.parse(msg.toString());
        console.log('Scraping result', data);

        const shot = new Screen({
            hash: name,
            url: req.body.url,
            creation_date: Date.now(),
            creator_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            image_path: data['image_path'],
            image_hash: data['image_hash']
        });
        shot.save().then(() => {
            console.log('screen saved');
            res.status(200).send({
                error: false,
                id: name
            });
        }).catch(e => {
            res.status(200).send({
                error: true
            });
        });
    });

});

app.get('/api/screen/:hash', (req, res) => {
    Screen.findOne({'hash': req.params.hash}, (err, screenshot) => {
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

app.use((req, res) => {
    res.status(404);
    res.send('404. Page does not exist');
});

server.listen(nconf.get('port'), nconf.get('host'), () => {
    console.log('start host: '+ nconf.get('host') + ' port: ' + nconf.get('port'));
});

