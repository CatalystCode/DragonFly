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
    let r = Math.floor((Math.random() * 100) + 1)
    let img = '/images/SurfaceBook_Office_V2.jpg'
    if (r % 3 == 0) {
      img = '/images/hp.png'
    } else if (r % 2 == 0) {
      img = '/images/mbp.jpg'
    }

    let laptopTemplate = $('#laptopTemplate')
    laptopTemplate.find('.panel-title').text(laptop.assetTag)
    laptopTemplate.find('img').attr('src', img)
    laptopTemplate.find('.laptop-asset-tag').text(laptop.assetTag)
    laptopTemplate.find('.laptop-user-id').text(laptop.userId)
    laptopTemplate.find('.btn-edit').attr('data-id', laptop.address)

    $('#laptopsRow').append(laptopTemplate.html())
  },

  handleAddLaptop: function () {
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
