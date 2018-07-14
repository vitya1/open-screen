'use strict';

const fs = require('fs');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

let port = process.env.port || 3000;
let host = process.env.host || '127.0.0.1';

app.use(express.static(__dirname + '/public/'));

app.get('/', (req, res) => {
    res.send('ewr');
//    res.render('index.html');
});

app.use((req, res) => {
    res.status(404);
    res.send('404. Page does not exist');
});

server.listen(port, host, function() {
    console.log('start host: '+ host + ' port: ' + port);
});

