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

  newDevice: function (serial, assetTag, ramSize, hddSize, userId) {
    return this.contract.new(serial, assetTag, ramSize, hddSize)
      .then((deploydContract) => {
        return deploydContract.assignToUser(userId)
          .then(() => Promise.resolve(deploydContract.address))
      })
      .catch((err) => Promise.reject(err))
  },

  updateHardware: function (contractAddress, newRamSize, newHDDSize, userId) {
    let contract = this.contract.at(contractAddress)
    return contract.updateHardware(newRamSize, newHDDSize)
      .then(() => contract.assignToUser(userId))
      .catch((err) => Promise.reject(err))
  },

  getDevice: function (contractAddress) {
    let contract = this.contract.at(contractAddress)

    let p = [
      contract.serial.call(),
      contract.assetTag.call(),
      contract.ramSize.call(),
      contract.hddSize.call(),
      contract.userid.call()]

    return Promise.all(p)
      .then(values => {
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
