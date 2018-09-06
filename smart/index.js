"use strict";

const os = require('os');
const fs = require('fs');
const path = require('path');
const zmq = require('zeromq');
const nconf = require('nconf');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const keythereum = require('keythereum');

const zpush = zmq.socket('push');
const zpull = zmq.socket('pull');

nconf.argv()
    .env()
    .file(path.join(__dirname, '.env.local'))
    .defaults({
        eth_path: path.join(
            os.homedir(),
            (os.platform() === 'darwin' ? 'Library/Ethereum/' : '.ethereum/')
        ),
    });

if(!nconf.get('web_sock') || !nconf.get('smart_sock')) {
    console.log('Error. Your socket parametres are not set');
    process.exit();
}

zpush.connect(nconf.get('web_sock'));
zpull.bindSync(nconf.get('smart_sock'));

const supported_platforms = ['darwin', 'freebsd', 'linux', 'openbsd'];
if(supported_platforms.indexOf(os.platform()) === -1) {
    console.log('Error. Your current platform is not supported');
    process.exit();
}
if(!nconf.get('account_password')) {
    console.log('Error. Your wallet password is not set');
    process.exit();
}

const account_address = nconf.get('account_address');
const contract_address = nconf.get('contract_address');

const key_object = keythereum.importFromFile(account_address, path.join(nconf.get('eth_path'), 'rinkeby'));//yet
const private_key = keythereum.recover(nconf.get('account_password'), key_object);

const abi = fs.readFileSync(path.join(__dirname, 'hesher_sol_ImgHesher.abi'));
const abi_json = JSON.parse(abi.toString());

const web3 = new Web3(new Web3.providers.HttpProvider(nconf.get('infura_endpoint')));
const contract = new web3.eth.Contract(abi_json, contract_address);

web3.eth.getTransactionCount(account_address).then(function(nonce) {
    let count = nonce;

    zpull.on('message', (msg) => {
        const data = JSON.parse(msg.toString());
        if(!data.url || !data.hash) {
            console.log('Error. Message must have url and hash');
            return;
        }

        let raw_transaction = {
            'from': account_address,
            'to': contract_address,
            'value': '0x0',
            'gasPrice': web3.utils.toHex(20 * 1e9),
            'gasLimit': web3.utils.toHex(240000),
            'data': contract.methods.push(data.url, data.hash, '').encodeABI(),//data.archive_hash
            'nonce': web3.utils.toHex(count++),
        };

        let transaction = new Tx(raw_transaction);
        transaction.sign(private_key);

        web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
            .catch(err => console.log('Transaction error', err));
    });

}).catch(err => console.log('Tx count error', err));
