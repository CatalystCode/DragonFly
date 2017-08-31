var Util = {
  baseName: 'https://mdfinancial-backend.azurewebsites.net',
  assetsUrl: '/api/assets',
  usersUrl: '/api/users',
  hardwareAbiUrl: 'assets/Hardware.json',

  getUsersUrl: function () {
    return this.baseName + this.usersUrl
  },

  getAssetsUrl: function () {
    return this.baseName + this.assetsUrl
  },

  getHardwareAbiUrl: function () {
    return this.hardwareAbiUrl
  },

  navigateHome: function () {
    window.location.href = '/'
  },

  compareLaptops: function (a, b) {
    return a.address > b.address
  },

  startSpinner: function () {
    $('.loader-overlay').removeClass('hidden')
  },

  stopSpinner: function () {
    $('.loader-overlay').addClass('hidden')
  },

  getRandomLaptopImage () {
    let r = Math.floor((Math.random() * 100) + 1)
    let img = '/images/SurfaceBook_Office_V2.jpg'
    if (r % 3 === 0) {
      img = '/images/hp.png'
    } else if (r % 2 === 0) {
      img = '/images/mbp.jpg'
    }
    return img
  },

  getUrlParameter: function (name) {
    var url = window.location.href
    name = name.replace(/[\[\]]/g, '\\$&')
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  },

  getRequest: function (url) {
    return new Promise((resolve, reject) => {
      $.get(url, resolve)
        .fail(reject)
    })
  },

  postRequest: function (url, data) {
    return new Promise((resolve, reject) => {
      $.post(url, data)
        .done(resolve)
        .fail(reject)
    })
  }
}
