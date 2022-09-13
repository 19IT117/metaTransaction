const Demo = artifacts.require('Demo');
const Web3 = require('web3');
const config1 = require('../build/contracts/Demo.json');
const config2 = require('../build/contracts/Proxy.json');
require('dotenv').config();
module.exports = async () => {
    //----------- fetching accounts -----------
    let accounts = await web3.eth.getAccounts();
 
    //----------- Creating Contract Instance ----------- 
    const DemoAddress = config1.networks['5777'].address;
    const DemoABI = config1.abi;
    const DemoInstance = new web3.eth.Contract(DemoABI,DemoAddress);

    const ProxyAddress = config2.networks['5777'].address;
    const ProxyABI = config2.abi;
    const ProxyInstance = new web3.eth.Contract(ProxyABI,ProxyAddress);
   
    let value = 1150;
    let calldata = '';
    let fnSignature = web3.utils.keccak256("changeX(uint256)").substr(0,10);
    
    let fnParams = web3.eth.abi.encodeParameters(['uint256'],[value]);
    calldata = fnSignature+ fnParams.substr(2);
    // console.log("calldata ---->",calldata);
   
    let rawData = web3.eth.abi.encodeParameters(['address','bytes'],[DemoAddress,calldata]);
    let hash = web3.utils.soliditySha3(rawData);
    
    let Signature =await web3.eth.accounts.sign(hash, process.env.PV1);
    // console.log("signature ---->",Signature.signature);
    // const result = await web3.eth.accounts.recover(Signature);
    // console.log("Recovering Address from signed message ----> ",result);     
    const result1 = await DemoInstance.methods.x().call();
    console.log("value of X Before sending transaction ---> ",result1);
    let balance0 = await web3.eth.getBalance(accounts[0]);
    console.log("balance of account 0 Before sending transaction",balance0);    
    let balance1 = await web3.eth.getBalance(accounts[1]);
    console.log("balance of account 1 Before sending transaction",balance1); 
    
    await ProxyInstance.methods.forward(DemoAddress,calldata,Signature.signature).send({from : accounts[1]});

    const result2 = await DemoInstance.methods.x().call();
    console.log("value of X after sending transaction ---> ",result2);
    balance0 = await web3.eth.getBalance(accounts[0]);
    console.log("balance of account 0 Before sending transaction",balance0);    
    balance1 = await web3.eth.getBalance(accounts[1]);
    console.log("balance of account 1 Before sending transaction",balance1); 
}







    //----------- Creating Raw Transaction Data ----------- 

    /*     
    
    const data = DemoInstance.methods.changeX(8000).encodeABI();
    const nonce = await web3.eth.getTransactionCount(accounts[0]);
    const txObj = {
        nonce : web3.utils.toHex(nonce),
        from : accounts[0],
        to : DemoAddress,
        //value : web3.utils.toHex(1000),
        data : data,
        gasLimit : web3.utils.toHex(100000),
        gasPrice : web3.utils.toHex(web3.utils.toWei('10','gwei')) 
    }

    console.log('Tx Object ----> ' , txObj);
    
    const signedTx = await web3.eth.accounts.signTransaction(txObj,process.env.PV1);
    console.log('Signed Tx ---->',signedTx);
    
    const result = await web3.eth.accounts.recover(signedTx);
    console.log("Recovering Address from signed message ----> ",result);  
    
    try{
        let tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction , {from : accounts[1]});
        console.log(tx);
    }catch(err){
        console.log(err.message);
    }
    
    */