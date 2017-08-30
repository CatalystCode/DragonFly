var Hardware = {
  web3Provider: null,

  init: function () {
        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
      Hardware.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      alert('No web3? You should consider using MetaMask')
      Hardware.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545')
      web3 = new Web3(Hardware.web3Provider)
    }

    web3.eth.defaultAccount = web3.eth.accounts[0]
  },

  getContract: function () {
    return new Promise((resolve, reject) => {
      $.getJSON('Hardware.json', function (data) {
                // Get the necessary contract artifact file and instantiate it with truffle-contract.
        let contract = TruffleContract(data)

                // Set the provider for our contract.
        contract.setProvider(Hardware.web3Provider)

        resolve(contract)
      })
    })
  },

  newDevice: function (serial, assetTag, ramSize, hddSize) {
    return new Promise((resolve, reject) => {
      Hardware.contract.new(serial, assetTag, ramSize, hddSize).then(contract => {
        if (!contract.address) {
          console.log('Contract transaction send: TransactionHash: ' + contract.transactionHash + ' waiting to be mined...')
        } else {
          console.log('Contract mined! Address: ' + contract.address)
        }
        resolve(contract)
      })
    })
  },

  assignToUser: function (contractAddress, userId) {
    let contract = Hardware.contract.at(contractAddress)
    if (contract != null) {
      contract.assignToUser(userId)
    }
  },

  newAssetTag: function (contractAddress, assetTag) {
    let contract = Hardware.contract.at(contractAddress)
    if (contract != null) {
      contract.assignNewAssetTag(assetTag)
    }
  },

  updateHardware: function (contractAddress, newRamSize, newHDDSize) {
    let contract = Hardware.contract.at(contractAddress)
    if (contract != null) {
      return contract.updateHardware(newRamSize, newHDDSize)
    }
  },

  freeLaptop: function (contractAddress) {
    let contract = Hardware.contract.at(contractAddress)
    if (contract != null) {
      return contract.freeLaptop()
    }
  },

  getDevice: function (contractAddress) {
    return this.getContract(contractAddress)
            .then(contract => {
              contract = contract.at(contractAddress)

              if (!contract) {
                return
              }

              var p1 = contract.serial.call()
              var p2 = contract.assetTag.call()
              var p3 = contract.ramSize.call()
              var p4 = contract.hddSize.call()
              var p5 = contract.userid.call()

              return Promise.all([p1, p2, p3, p4, p5]).then(values => {
                    // oh my god. I'm so sorry.
                values[2] = values[2].toNumber()
                values[3] = values[3].toNumber()

                    // [ "serial", "assetTag", 0, 0, "userId"]
                return values
              })
            })
  }
}

// $(function() {
//     $(window).load(function() {
//       Hardware.init();
//     });
// });
