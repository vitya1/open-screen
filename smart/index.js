"use strict";

const os = require('os');
const fs = require('fs');
const path = require('path');
const net = require('net');
const zmq = require('zeromq');
const nconf = require('nconf');
const Web3 = require('web3');

const zpush = zmq.socket('push');
const zpull = zmq.socket('pull');

nconf.argv()
    .env()
    .file(path.join(__dirname, '.env.local'));

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

const ipc_path = path.join(os.homedir(), (os.platform() === 'darwin' ? 'Library/Ethereum/' : '.ethereum/'), 'geth.ipc');
const web3 = new Web3(new Web3.providers.IpcProvider(ipc_path, net));

const abi = fs.readFileSync(path.join(__dirname, 'hesher_sol_ImgHesher.abi'));
const abi_json = JSON.parse(abi.toString());

const hesher_contract_addr = nconf.get('contract_address');
const hesher_contract = new web3.eth.Contract(abi_json, hesher_contract_addr, {
    gasLimit: 200000
});
//console.log(hesher_contract.methods);
//console.log(web3.eth.personal.getAccounts().then(res => console.log(res)));

web3.eth.getAccounts().then(result => {
    let main_address = result[0];

    zpull.on('message', (msg) => {
        web3.eth.personal.unlockAccount(main_address, nconf.get('account_password'))
            .then(res => {
                let data = JSON.parse(msg.toString());
                if(!data.url || !data.hash) {
                    console.log('Error. Message must have url and hash');
                    return;
                }

                hesher_contract.methods.push(data.hash, data.url)
                    .send({from: result[0]})
                //    .estimateGas()
                    .then(receipt => {
                        //@todo get number in blockchain array
                        zpush.send(JSON.stringify([data.name, receipt]));
                    }).catch(err => console.log('Transaction error', err));

            }).catch(auth_err => console.log('Auth error', auth_err));
        });

}).catch(err => console.log('Account error', err));

