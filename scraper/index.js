const path = require('path');
const zmq = require('zeromq');
const nconf = require('nconf');
const scraper = require('./scraper');

const zpush = zmq.socket('push');
const zpull = zmq.socket('pull');

nconf.argv()
    .env()
    .file(path.join(__dirname, '.env.local'));

if(!nconf.get('web_sock') || !nconf.get('scraper_sock')) {
    console.log('Error. Your wallet password is not set');
    process.exit();
}

zpush.connect(nconf.get('web_sock'));
zpull.bindSync(nconf.get('scraper_sock'));

sock_pull.on('message', async (msg) => {
    let data = JSON.parse(msg.toString());
    if(!data.url) {
        console.log('Error. Message must have url property');
        return;
    }

    let result = await (new scraper()).run(data.url, nconf.get('storage'));
    console.log('Scraping result', result);
    zpush.send(result);
});
