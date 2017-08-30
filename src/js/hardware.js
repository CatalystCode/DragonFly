var Hardware = {
  init: function (data) {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      alert('No web3? You should consider using MetaMask')
      window.location.href = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'
      return
    }

    // Get the necessary contract artifact file and instantiate it with truffle-contract.
    this.contract = TruffleContract(data)
    this.contract.setProvider(this.web3Provider)
  },

  getJSON: function (url) {
    return new Promise((resolve, reject) => {
      $.getJSON(url, function (data) {
        if (!data) {
          return reject(new Error('Was not able to fetch data'))
        }
        resolve(data)
      })
    })
  },

  newDevice: function (serial, assetTag, ramSize, hddSize, userId) {
    let self = this
    return this.contract.new(serial, assetTag, ramSize, hddSize)
      .then((deploydContract) => {
        return deploydContract.assignToUser(userId)
          .then(() => {
            return self.getDevice(deploydContract.address)
          })
      })
      .catch((err) => {
        return Promise.reject(err)
      })
  },

  updateHardware: function (contractAddress, newRamSize, newHDDSize, userId) {
    let self = this
    let contract = this.contract.at(contractAddress)
    return contract.updateHardware(newRamSize, newHDDSize)
      .then(() => {
        return contract.assignToUser(userId)
          .then(() => {
            return self.getDevice(contractAddress)
          })
      })
      .catch((err) => {
        return Promise.reject(err)
      })
  },

  getDevice: function (contractAddress) {
    let contract = this.contract.at(contractAddress)
    if (!contract) {
      return Promise.reject(new Error('Address does not exists'))
    }

    let p1 = contract.serial.call()
    let p2 = contract.assetTag.call()
    let p3 = contract.ramSize.call()
    let p4 = contract.hddSize.call()
    let p5 = contract.userid.call()

    return Promise.all([p1, p2, p3, p4, p5]).then(values => {
      return {
        serialNumber: values[0] || 'Not found',
        assetTag: values[1] || 'Not found',
        ram: values[2] ? values[2].toNumber() : 'Not found',
        hardDrive: values[3] ? values[3].toNumber() : 'Not found',
        userId: values[4] || 'Not found',
        address: contractAddress
      }
    })
  }
}

const testNewDeviceSunny = (hw) => {
  console.log('Testing testNewDeviceSunny')
  hw.newDevice('serialNumber', 'assetTag', 16, 256, 'userid')
    .then((res) => {
      console.log('Success')
      console.log(res)
    })
    .catch((err) => {
      console.log('Error')
      console.log(err)
    })
}

const testUpdateHardware = (hw, addr) => {
  console.log('Testing testUpdateHardware')
  hw.updateHardware(addr, 32, 512, 'userid12')
    .then((res) => {
      console.log('Success')
      console.log(res)
    })
    .catch((err) => {
      console.log('Error')
      console.log(err)
    })
}

const testGetDevice = (hw, addr) => {
  console.log('Testing testGetDevice')
  hw.getDevice(addr)
    .then((res) => {
      console.log('Success')
      console.log(res)
    })
    .catch((err) => {
      console.log('Error')
      console.log(err)
    })
}
