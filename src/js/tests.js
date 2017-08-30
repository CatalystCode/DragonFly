Test = {
  getContractAddressesTest: (app, url) => {
    app.getContractAddresses(url)
      .then(res => {
        console.log('Success')
        console.log(res)
      })
      .catch(err => {
        console.log('err')
        console.error(err)
      })
  },

  testNewDeviceSunny: (hw) => {
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
  },

  testUpdateHardware: (hw, addr) => {
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
  },

  testGetDevice: (hw, addr) => {
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
}
