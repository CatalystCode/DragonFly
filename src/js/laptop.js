App = {
  editMode: 'edit',

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

        Util.getUrlParameter('mode') === this.editMode ? this.initEditLaptop() : this.initAddLaptop()
      })
  },

  initAddLaptop: function () {
    $('#page-title').text('Add Laptop')
    $(document).on('click', '.btn-submit', this.handleAddLaptop(this))
  },

  initEditLaptop: function () {
    $('#page-title').text('Edit Laptop')
    $(document).on('click', '.btn-submit', this.handleEditLaptop(this))

    let self = this
    this.address = decodeURIComponent(Util.getUrlParameter('id'))
    Hardware.getDevice(this.address)
      .then(self.setLaptopValues)
      .catch(self.handleError)
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
      Util.startSpinner()
      let laptop = self.getLaptopValues()

      Hardware.newDevice(laptop.serialNumber, laptop.assetTag, laptop.ram, laptop.hardDrive, laptop.userId)
        .then((address) => Util.postRequest(Util.getAssetsUrl(), { address: address, img: Util.getRandomLaptopImage() }))
        .then(Util.navigateHome)
        .catch(self.handleError)

      return event.preventDefault()
    }
  },

  handleEditLaptop: function (self) {
    return function (event) {
      Util.startSpinner()
      let laptop = self.getLaptopValues()
      Hardware.updateHardware(self.address, laptop.ram, laptop.hardDrive, laptop.userId)
        .then(Util.navigateHome)
        .catch(self.handleError)

      return event.preventDefault()
    }
  },

  handleError: function (err) {
    Util.stopSpinner()
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
