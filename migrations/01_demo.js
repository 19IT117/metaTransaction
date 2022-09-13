const Demo = artifacts.require('Demo');

module.exports = async (deployer) => {
    deployer.deploy(Demo);
}