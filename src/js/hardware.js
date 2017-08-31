var Hardware = {
  init: function (data) {
    this.contract = TruffleContract(data)
    this.contract.setProvider(new Web3.providers.HttpProvider(Util.getRPCUrl()))
  },

  newDevice: function (serial, assetTag, ramSize, hddSize, userId) {
    return this.contract.new(serial, assetTag, ramSize, hddSize, Util.getTransactionOption())
      .then((deploydContract) => {
        return deploydContract.assignToUser(userId, Util.getTransactionOption())
          .then(() => Promise.resolve(deploydContract.address))
      })
      .catch((err) => Promise.reject(err))
  },

  updateHardware: function (contractAddress, newRamSize, newHDDSize, userId) {
    let contract = this.contract.at(contractAddress)
    return contract.updateHardware(newRamSize, newHDDSize, Util.getTransactionOption())
      .then(() => contract.assignToUser(userId, Util.getTransactionOption()))
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
