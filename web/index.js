'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');
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
const smart_push = zmq.socket('push');
const smart_pull = zmq.socket('pull');

if(!nconf.get('scraper_pull') || !nconf.get('scraper_push')
    || !nconf.get('smart_pull') || !nconf.get('smart_push')) {
    console.log('Error. You must specify all socket variables');
    process.exit();
}

console.log('Scraper push sock', nconf.get('scraper_push'));
console.log('Smart contract push sock', nconf.get('smart_push'));

scraper_push.connect(nconf.get('scraper_push'));
scraper_pull.bindSync(nconf.get('scraper_pull'));
smart_push.connect(nconf.get('smart_push'));
smart_pull.bindSync(nconf.get('smart_pull'));

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, '../front/dist/')));
app.use('/storage', express.static(path.join(__dirname, '../storage/')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render(path.join(__dirname, '../front/dist/index.html'));
});

app.get('/about', (req, res) => {
    res.render(path.join(__dirname, '../front/dist/index.html'));
});

app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /');
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

app.post('/api/screen/add', (req, res) => {
    const name = randomatic('aA0', 12);

    try {
        new URL(req.body.url);
    }
    catch(e) {
        res.status(200).send({
            error: true
        });
        return;
    }

    scraper_push.send(JSON.stringify({
        name: name,
        url: req.body.url
    }));

    //@todo move to socket io
    scraper_pull.on('message', (msg) => {
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
            const url = req.protocol + '://' + req.get('host');
            console.log(url);
            smart_push.send(JSON.stringify({
                hash: data['image_hash'],
                url: url + '/' + name,
                name: name
            }));

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

app.use((req, res) => {
    res.status(404);
    res.send('404. Page does not exist');
});

server.listen(nconf.get('port'), nconf.get('host'), () => {
    console.log('start host: '+ nconf.get('host') + ' port: ' + nconf.get('port'));
});

smart_pull.on('message', (msg) => {
    let data = JSON.parse(msg.toString());
    console.log('Transaction result', data);
    Screen.findOne({'hash': data[0]}, (err, screenshot) => {
        if (err)  {
            console.warn('Record not found');
            return false;
        }
        const receipt = data[1];
        screenshot.transaction_id = receipt['transactionHash'];
        screenshot.transaction_data = JSON.stringify(receipt);
        //screenshot.blockchain_id = Number,
        screenshot.save().then(r => console.log('transaction hash saved'))
            .catch(e => console.warn('Error saving transaction hash'));
    });
});
