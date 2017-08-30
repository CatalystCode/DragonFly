App = {
  web3Provider: null,
  contracts: {},
  mode: 'add',

  init: function () {
    $(document).on('click', '.btn-submit', App.handleSubmit(this))

    this.getAADUsers('http://mdfinancial-backend.azurewebsites.net/api/auth')
      .then(users => {
        console.log('users', users)
        users.map(user => {
          $('#userIdSelect')
            .append($('<option>', {
              value: user.displayName,
              text: user.displayName
            }))
        })

        let mode = App.getUrlParameter('mode')
        switch (mode) {
          case 'edit':
            App.initEditLaptop()
            break
          default:
            App.initAddLaptop()
            break
        }
      })
  },

  getAADUsers: function (url) {
    return new Promise((resolve, reject) => {
      $.get(url, resolve)
        .fail(reject)
    })
  },

  initAddLaptop: function () {
    $('#page-title').text('Add Laptop')
    App.mode = 'add'
  },

  initEditLaptop: function () {
    $('#page-title').text('Edit Laptop')
    App.mode = 'edit'

    var address = App.getLaptopContractAddress()
    let self = this
    Hardware.getDevice(address).then(function (laptop) {
      self.setLaptopValues(laptop)
    })
  },

  setLaptopValues: function (laptop) {
    console.log(laptop)
    $('#serialNumberInput').val(laptop.serialNumber)
    $('#serialNumberInput').prop('disabled', true)
    $('#assetTagInput').val(laptop.assetTag)
    $('#assetTagInput').prop('disabled', true)
    $('#hardDriveInput').val(laptop.hardDrive)
    $('#ramInput').val(laptop.ram)
    $('#userIdSelect').val(laptop.userId)
  },

  getLaptopContractAddress () {
    return decodeURIComponent(App.getUrlParameter('id'))
  },

  handleSubmit: function (self) {
    return function () {
      event.preventDefault()

      let laptop = {
        serialNumber: $('#serialNumberInput').val(),
        assetTag: $('#assetTagInput').val(),
        hardDrive: $('#hardDriveInput').val(),
        ram: $('#ramInput').val(),
        userId: $('#userIdSelect').find(':selected').val()
      }

      console.log(laptop)
      if (App.mode === 'edit') {
        // console.log('Editing laptop')
        var address = App.getLaptopContractAddress()
        Hardware.updateHardware(address, laptop.ram, laptop.hardDrive, laptop.userId)
          .then(function (updatedLaptop) {
            self.setLaptopValues(updatedLaptop)
          })
      } else {
        // console.log('Creating new laptop')
        Hardware.newDevice(laptop.serialNumber, laptop.assetTag, laptop.ram, laptop.hardDrive, laptop.userId)
          .then(function (newLaptop) {
            self.setLaptopValues(newLaptop)

            // add the laptop to mongodb
            $.post('http://mdfinancial-backend.azurewebsites.net/api/assets', { address: newLaptop.address })
          })
      }
    }
  },

  getUrlParameter: function (name) {
    var url = window.location.href
    name = name.replace(/[\[\]]/g, '\\$&')
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }

}

$(() => {
  $(window).load(() => {
    Hardware.getJSON('assets/Hardware.json')
      .then(data => {
        Hardware.init(data)
        App.init()
      })
  })
})
