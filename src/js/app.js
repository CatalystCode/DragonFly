App = {
  init: function () {
    let self = this
    Util.getRequest(Util.getAssetsUrl())
      .then(results => {
        results.map(res => {
          Hardware.getDevice(res.address)
            .then(self.loadLaptop)
            .catch(err => console.log('Failed to get error'))
        })
      })
      .catch(err => alert('Failed to get Assets'))

    $(document).on('click', '.btn-edit', this.handleAddLaptop)
  },

  loadLaptop: function (laptop) {
    let laptopTemplate = $('#laptopTemplate')
    laptopTemplate.find('.panel-title').text(laptop.assetTag)
    laptopTemplate.find('img').attr('src', laptop.img || Util.getRandomLaptopImage())
    laptopTemplate.find('.laptop-asset-tag').text(laptop.assetTag)
    laptopTemplate.find('.laptop-user-id').text(laptop.userId)
    laptopTemplate.find('.btn-edit').attr('data-id', laptop.address)

    $('#laptopsRow').append(laptopTemplate.html())
  },

  handleAddLaptop: function (event) {
    let laptopId = encodeURIComponent($(event.target).data('id'))
    window.location = 'laptop.html?mode=edit&id=' + laptopId
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
