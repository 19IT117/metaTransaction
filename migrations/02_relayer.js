const Relayer = artifacts.require('Proxy');

module.exports = async (deployer) => {
    deployer.deploy(Relayer);
}