//Whitelisting Account[0] as the signer for the contract 
const Demo = artifacts.require('Demo');
const Web3 = require('web3');
const config1 = require('../build/contracts/Demo.json');
const config2 = require('../build/contracts/Proxy.json');
require('dotenv').config();

module.exports = async () => {
    let accounts = await web3.eth.getAccounts();
    const ProxyAddress = config2.networks['5777'].address;
    const ProxyABI = config2.abi;
    const ProxyInstance = new web3.eth.Contract(ProxyABI,ProxyAddress);

    await ProxyInstance.methods.addToWhitelist(accounts[0],true).send({from : accounts[0]}).then(console.log);

}