var Util = {
  baseName: 'https://mdfinancial-backend.azurewebsites.net',
  assetsUrl: '/api/assets',
  usersUrl: '/api/users',
  gethProxy: '/api/geth',
  hardwareAbiUrl: 'assets/Hardware.json',

  accountAddress: '0xae57095f12fb7e760532eea08486153497f42430',
  gasLimit: 999999,
  gasPrice: 30000000,

  getUsersUrl: function () {
    return this.baseName + this.usersUrl
  },

  getAssetsUrl: function () {
    return this.baseName + this.assetsUrl
  },

  getRPCUrl: function () {
    return this.baseName + this.gethProxy
  },

  getHardwareAbiUrl: function () {
    return this.hardwareAbiUrl
  },

  navigateHome: function () {
    window.location.href = '/'
  },

  getTransactionOption: function () {
    return {
      from: this.accountAddress,
      gas: this.gasLimit,
      gasPrice: this.gasPrice
    }
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

  getRandomLaptopImage: function () {
    let laptopImages = [
      '/images/SurfaceBook_Office_V2.jpg',
      '/images/hp.png',
      '/images/mbp.jpg'
    ]

    return laptopImages[Math.floor(Math.random() * laptopImages.length)]
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
