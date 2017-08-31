App = {
  mode: 'add',

  init: function () {
    Util.getRequest(Util.getUsersUrl())
      .then(users => {
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
    $(document).on('click', '.btn-submit', this.handleAddLaptop(this))

    this.mode = 'add'
  },

  initEditLaptop: function () {
    $('#page-title').text('Edit Laptop')
    $(document).on('click', '.btn-submit', this.handleEditLaptop(this))

    this.mode = 'edit'
    this.address = decodeURIComponent(Util.getUrlParameter('id'))
    let self = this
    Hardware.getDevice(this.address).then(function (laptop) {
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

  getLaptopValues: function () {
    return {
      serialNumber: $('#serialNumberInput').val(),
      assetTag: $('#assetTagInput').val(),
      hardDrive: $('#hardDriveInput').val(),
      ram: $('#ramInput').val(),
      userId: $('#userIdSelect').find(':selected').val()
    }
  },

  handleAddLaptop: function (self) {
    return function (event) {
      $('#submit-btn').prop('disabled', true)
      let laptop = self.getLaptopValues()
      Hardware.newDevice(laptop.serialNumber, laptop.assetTag, laptop.ram, laptop.hardDrive, laptop.userId)
      .then(function (address) {
        Util.postRequest(Util.getAssetsUrl(), { address: address, img: Util.getRandomLaptopImage() })
          .then(Util.navigateHome)
      })
      .catch(self.handleError)

      return event.preventDefault()
    }
  },

  handleEditLaptop: function (self) {
    return function (event) {
      $('#submit-btn').prop('disabled', true)
      let laptop = self.getLaptopValues()
      Hardware.updateHardware(self.address, laptop.ram, laptop.hardDrive, laptop.userId)
        .then(Util.navigateHome)
        .catch(self.handleError)

      return event.preventDefault()
    }
  },

  handleError: function (err) {
    $('#submit-btn').prop('disabled', false)
    alert('Something went wrong, please try again')
  }
}

$(window).ready(() => {
  Util.getRequest(Util.getHardwareAbiUrl())
    .then(data => {
      Hardware.init(data)
      App.init()
    })
})
