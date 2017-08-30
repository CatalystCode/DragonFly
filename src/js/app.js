App = {
  backendUrl: 'https://mdfinancial-backend.azurewebsites.net/api/assets',

  init: function () {
    this.getContractAddresses(this.backendUrl)
      .then(results => {
        results.map(res => {
          Hardware.getDevice(res.address)
            .then(App.loadLaptop)
            .catch(err => console.log('Failed to get error'))
        })
      })
      .catch(err => alert('Failed to get Assets'))

    $(document).on('click', '.btn-edit', App.handleAddLaptop)
  },

  getContractAddresses: function (url) {
    return new Promise((resolve, reject) => {
      $.get(url, resolve)
        .fail(reject)
    })
  },

  loadLaptop: function (laptop) {
    // load the template
    let laptopsRow = $('#laptopsRow')
    let laptopTemplate = $('#laptopTemplate')

    let r = Math.floor((Math.random() * 100) + 1)
    let img = '/images/SurfaceBook_Office_V2.jpg'
    if (r % 3 == 0) {
      img = '/images/hp.png'
    } else if (r % 2 == 0) {
      img = '/images/mbp.jpg'
    }

    laptopTemplate.find('.panel-title').text(laptop.assetTag)
    laptopTemplate.find('img').attr('src', img)
    laptopTemplate.find('.laptop-asset-tag').text(laptop.assetTag)
    laptopTemplate.find('.laptop-user-id').text(laptop.userId)
    laptopTemplate.find('.btn-edit').attr('data-id', laptop.address)

    laptopsRow.append(laptopTemplate.html())
  },

  handleAddLaptop: function () {
    let laptopId = encodeURIComponent($(event.target).data('id'))
    window.location = 'laptop.html?mode=edit&id=' + laptopId
    return event.preventDefault()
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

const getContractAddressesTest = (App, url) => {
  App.getContractAddresses(url)
    .then(res => {
      console.log('Success')
      console.log(res)
    })
    .catch(err => {
      console.log('err')
      console.error(err)
    })
}
