const Demo = artifacts.require('Demo');
const Web3 = require('web3');
const config1 = require('../build/contracts/Demo.json');
require('dotenv').config();
module.exports = async () => {
    //----------- fetching accounts -----------
    let accounts = await web3.eth.getAccounts();
 
    //----------- Creating Contract Instance ----------- 
    const address = config1.networks['5777'].address;
    const abi = config1.abi;
    const DemoInstance = new web3.eth.Contract(abi,address);
 
    //----------- Creating Raw Transaction Data ----------- 

    /*     const data = DemoInstance.methods.changeX(8000).encodeABI();
    const nonce = await web3.eth.getTransactionCount(accounts[0]);
    const txObj = {
        nonce : web3.utils.toHex(nonce),
        from : accounts[0],
        to : address,
        //value : web3.utils.toHex(1000),
        data : data,
        gasLimit : web3.utils.toHex(100000),
        gasPrice : web3.utils.toHex(web3.utils.toWei('10','gwei')) 
    }

    console.log('Tx Object ----> ' , txObj);
    
    const signedTx = await web3.eth.accounts.signTransaction(txObj,process.env.PV1);
    console.log('Signed Tx ---->',signedTx);
    
    const result = await web3.eth.accounts.recover(signedTx);
    console.log("Recovering Address from signed message ----> ",result);  */
    



    let value = 1150;
    let calldata = '';
    let fnSignature = web3.utils.keccak256("changeX(uint256)").substr(0,10);
    //console.log("function Signature ----> ",fnSignature);
    
    let fnParams = web3.eth.abi.encodeParameters(['uint256'],[value]);
    //console.log("function parameter ----> " , fnParams);
    calldata = fnSignature+ fnParams.substr(2);
    console.log("calldata ---->",calldata);
   
    let rawData = web3.eth.abi.encodeParameters(['address','bytes'],[address,calldata]);
    let hash = web3.utils.soliditySha3(rawData);
    console.log()
    //console.log("hash ---->",hash);
    let Signature =await web3.eth.accounts.sign(hash, process.env.PV1);
    console.log("Signature ----> ",Signature);
    const result = await web3.eth.accounts.recover(Signature);
    console.log("Recovering Address from signed message ----> ",result); 
    
    const result2 = await DemoInstance.methods.x().call();
    console.log(result2);
    // try{
    //     let tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction , {from : accounts[1]});
    //     console.log(tx);
    // }catch(err){
    //     console.log(err.message);
    // }
    
}