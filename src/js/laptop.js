App = {
  mode: 'add',

  init: function () {
    $(document).on('click', '.btn-submit', this.handleSubmit)

    Util.getRequest(Util.getUsersUrl())
      .then(users => {
        console.log('users', users)
        users.map(user => {
          $('#userIdSelect')
            .append($('<option>', {
              value: user.displayName,
              text: user.displayName
            }))
        })

        let mode = Util.getUrlParameter('mode')
        switch (mode) {
          case 'edit':
            this.initEditLaptop()
            break
          default:
            this.initAddLaptop()
            break
        }
      })
  },

  initAddLaptop: function () {
    $('#page-title').text('Add Laptop')
    this.mode = 'add'
  },

  initEditLaptop: function () {
    $('#page-title').text('Edit Laptop')
    this.mode = 'edit'

    var address = this.getLaptopContractAddress()
    let self = this
    Hardware.getDevice(address).then(function (laptop) {
      self.setLaptopValues(laptop)
    })
  },

  setLaptopValues: function (laptop) {
    $('#serialNumberInput').val(laptop.serialNumber)
    $('#serialNumberInput').prop('disabled', true)
    $('#assetTagInput').val(laptop.assetTag)
    $('#assetTagInput').prop('disabled', true)
    $('#hardDriveInput').val(laptop.hardDrive)
    $('#ramInput').val(laptop.ram)
    $('#userIdSelect').val(laptop.userId)
  },

  getLaptopContractAddress () {
    return decodeURIComponent(Util.getUrlParameter('id'))
  },

  handleSubmit: function () {
    $('#submit-btn').prop('disabled', true)

    let laptop = {
      serialNumber: $('#serialNumberInput').val(),
      assetTag: $('#assetTagInput').val(),
      hardDrive: $('#hardDriveInput').val(),
      ram: $('#ramInput').val(),
      userId: $('#userIdSelect').find(':selected').val()
    }

    console.log(laptop)
    if (this.mode === 'edit') {
      console.log('Editing laptop')
      var address = this.getLaptopContractAddress()
      Hardware.updateHardware(address, laptop.ram, laptop.hardDrive, laptop.userId)
        .then(Util.navigateHome)
        .catch((err) => {
          $('#submit-btn').prop('disabled', false)
          alert('Something went wrong, please try again')
        })
    } else {
      console.log('New laptop')
      Hardware.newDevice(laptop.serialNumber, laptop.assetTag, laptop.ram, laptop.hardDrive, laptop.userId)
        .then(function (address) {
          Util.postRequest(Util.getAssetsUrl(), { address: address })
            .then(Util.navigateHome)
        })
        .catch((err) => {
          $('#submit-btn').prop('disabled', false)
          alert('Something went wrong, please try again')
        })
    }

    return event.preventDefault()
  }
}

$(() => {
  $(window).load(() => {
    Util.getRequest(Util.getHardwareAbiUrl())
      .then(data => {
        Hardware.init(data)
        App.init()
      })
  })
})
