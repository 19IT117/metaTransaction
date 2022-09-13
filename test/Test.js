const truffleAssert = require('truffle-assertions');
const Demo = artifacts.require('Demo');
const Proxy = artifacts.require('Proxy');
const Web3 = require('web3');
const config1 = require('../build/contracts/Demo.json');
const config2 = require('../build/contracts/Proxy.json');
const test = require('dotenv').config();

contract('Meta Transaction', async(accounts)=>{
    let DemoInstance;
    let ProxyInstance;
    let balance0;
    let balance1;
    before(async ()=>{
        DemoInstance = await Demo.deployed();
        ProxyInstance = await Proxy.deployed();
    });
    
    it('checking contract is deployed properly', async () => {
        assert(DemoInstance.address != '' && ProxyInstance.address != '' , "Contract Address doesn't exists");
    });
    it('whitelisting account[0]', async() => {
        await ProxyInstance.addToWhitelist(accounts[0],true, {from : accounts[0]});
        const result =await ProxyInstance.isWhitelisted(accounts[0]);
        assert(result == true , "Account 0 isn't whitelisted");
    });
    it('whitelisting account[1] from non-owner', async() => {
        await truffleAssert.reverts(
            ProxyInstance.addToWhitelist(accounts[1],true, {from : accounts[2]}),
            "Only Owner"
        )
    });
    it('checking initial value of X and Balance of Accounts', async ()=> {
        const result = await DemoInstance.x();
        balance0 = await web3.eth.getBalance(accounts[0]);
        balance1 = await web3.eth.getBalance(accounts[1]);
        assert(result == 0);
    });
    it('sending meta transaction from account1', async ()=> {
        let value = 11;
        let calldata = '';
        let fnSignature = web3.utils.keccak256("changeX(uint256)").substr(0,10);
        
        let fnParams = web3.eth.abi.encodeParameters(['uint256'],[value]);
        calldata = fnSignature+ fnParams.substr(2);
        let rawData = web3.eth.abi.encodeParameters(['address','bytes'],[DemoInstance.address,calldata]);
        let hash = web3.utils.soliditySha3(rawData);
        let Signature =await web3.eth.accounts.sign(hash, process.env.PV1);
        await ProxyInstance.forward(DemoInstance.address,calldata,Signature.signature,{from : accounts[1]});
        const result1 = await DemoInstance.x();
        assert(result1 == value,"value didn't change");
        let balance0_1 = await web3.eth.getBalance(accounts[0]);
        let balance1_1 =  await web3.eth.getBalance(accounts[1]);
        assert (balance0 == balance0_1, "balance of Account 0 deducted");
        assert(balance1_1< balance1, "balance of Account 1 didn't change");
    });
    it('sending transaction for non-whitelisted account',async() =>{
        let value = 117;
        let calldata = '';
        let fnSignature = web3.utils.keccak256("changeX(uint256)").substr(0,10);
        let fnParams = web3.eth.abi.encodeParameters(['uint256'],[value]);
        calldata = fnSignature+ fnParams.substr(2);
        let rawData = web3.eth.abi.encodeParameters(['address','bytes'],[DemoInstance.address,calldata]);
        let hash = web3.utils.soliditySha3(rawData);
        let Signature =await web3.eth.accounts.sign(hash, process.env.PV2);
        await truffleAssert.reverts(
            ProxyInstance.forward(DemoInstance.address,calldata,Signature.signature,{from : accounts[1]}),
            "Signature validation failed"
        )
    });
})