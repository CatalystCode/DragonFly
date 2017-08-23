var Migrations = artifacts.require("./Hardware.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
