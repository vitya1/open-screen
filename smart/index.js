"use strict";

const os = require('os');
const fs = require('fs');
const path = require('path');
const net = require('net');
const nconf = require('nconf');
const Web3 = require('web3');

nconf.argv()
    .env()
    .file(path.join(__dirname, '.env.local'));

const supported_platforms = ['darwin', 'freebsd', 'linux', 'openbsd'];
if(supported_platforms.indexOf(os.platform()) === -1) {
    console.log('Error. Your current platform is not supported');
    process.exit();
}
if(!nconf.get('password')) {
    console.log('Error. Your wallet password is not set');
    process.exit();
}

const ipc_path = path.join(os.homedir(), (os.platform() === 'darwin' ? 'Library/Ethereum/' : '.ethereum/'), 'geth.ipc');
const web3 = new Web3(new Web3.providers.IpcProvider(ipc_path, net));

const abi = fs.readFileSync(path.join(__dirname, 'hesher_sol_ImgHesher.abi'));
const abi_json = JSON.parse(abi.toString());

const hesher_contract_addr = nconf.get('contract_address');
const hesher_contract = new web3.eth.Contract(abi_json, hesher_contract_addr, {
    gasLimit: 120000
});
//console.log(hesher_contract.methods);
//console.log(web3.eth.personal.getAccounts().then(res => console.log(res)));

let str = '0xf619A591958be008aE19b249A2Bc63e0697438C60xf619A591958be008aE19b249A2Bc63e0697438C60xf619A591958be008aE19b249A2Bc63e0697438C6';
web3.eth.getAccounts().then(result => {
    let main_address = result[0];
    web3.eth.personal.unlockAccount(main_address, nconf.get('password'))
        .then(res => {
            hesher_contract.methods.push(str)
                //.send({from: result[0]})
                .estimateGas()
                .then(receipt => console.log(receipt))
                .catch(err => console.log('Transaction error', err));

        }).catch(auth_err => console.log('Auth error', auth_err));

}).catch(err => console.log('Account error', err));

