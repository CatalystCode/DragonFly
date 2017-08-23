var Hardware = {
    web3Provider: null,
    contract: null, 
  
    init: function() {
        // Initialize web3 and set the provider to the testRPC.
        if (typeof web3 !== 'undefined') {
            Hardware.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            Hardware.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
            web3 = new Web3(Hardware.web3Provider);
        }

        web3.eth.defaultAccount = web3.eth.accounts[0];

        Hardware.initContract();
    },
 
    initContract: function() {
        $.getJSON('Hardware.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var HardwareArtifact = data;
            Hardware.contract = TruffleContract(HardwareArtifact);
          
            // Set the provider for our contract.
            Hardware.contract.setProvider(Hardware.web3Provider);
        });
    },
    
    newDevice: function(serial, assetTag, ramSize, hddSize) {
        return new Promise((resolve, reject) => {
            Hardware.contract.new(serial, assetTag, ramSize, hddSize).then(contract => {
                if (!contract.address) {
                    console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
                } else {
                    console.log("Contract mined! Address: " + contract.address);
                }
                resolve(contract);
            })
        });
    },

    assignToUser: function(contractAddress, userId) {
        return Hardware.contract.at(contractAddress).assignToUser(userId);
    },

    newAssetTag: function(contractAddress, assetTag) {
        return Hardware.contract.at(contractAddress).assignNewAssetTag(assetTag);
    },

    updateHardware: function(contractAddress, newRamSize, newHDDSize) {
        return Hardware.contract.at(contractAddress).updateHardware(newRamSize, newHDDSize);
    },

    freeLaptop: function(contractAddress) {
        return Hardware.contract.at(contractAddress).freeLaptop();
    },

    getDevice: function(contractAddress) {
        var contract = Hardware.contract.at(contractAddress);

        var p1 = contract.serial.call();
        var p2 = contract.assetTag.call();
        var p3 = contract.ramSize.call();
        var p4 = contract.hddSize.call();
        var p5 = contract.userid.call();

        return Promise.all([p1, p2, p3, p4, p5]).then(values => { 
            // oh my god. I'm so sorry.
            values[2] = values[2].c[0];
            values[3] = values[3].c[0];

            // [ "serial", "assetTag", 0, 0, "userId"]
            console.log(values); 
        });
    }
};

// such a hack
$(function() {
    $(window).load(function() {
      Hardware.init();
    });
  });