App = {
  web3Provider: null,
  contracts: {},
  mode: "add",

  init: function() {
    // figure out the page state
    var mode = App.getUrlParameter('mode');
    switch(mode) {
      case "edit": 
      App.initEditLaptop();
      break;
      default: 
      App.initAddLaptop();
      break;
    }

    $(document).on('click', '.btn-submit', App.handleSubmit);

    return App.initWeb3();
  },

  initAddLaptop: function() {
    $("#page-title").text("Add Laptop");
  },

  initEditLaptop: function() {
    $("#page-title").text("Edit Laptop");

    $("#serialNumberInput").val("zzzzzz");
    $("#assetTagInput").val("yyyyyyy");
    $("#hardDriveInput").val("cccccccc");
    $("#cpuInput").val("hsdhdhfhdfhdfh");
  },

  initWeb3: function() {
    /*
     * Replace me...
     */

    return App.initContract();
  },

  initContract: function() {
    /*
     * Replace me...
     */
  },

  handleSubmit: function() {
    event.preventDefault();

    var serialNumber = $("#serialNumberInput").val();
    var assetTag = $("#assetTagInput").val();
    var hardDrive = $("#hardDriveInput").val();
    var ram = $("#ramInput").val();
    var userId = $('#userIdSelect').find(":selected").text();

    Hardware.newDevice(serialNumber, assetTag, ram, hardDrive).then(function(contract){
      Hardware.assignToUser(contract.address, userId);
    });

    console.log(serialNumber + assetTag + hardDrive + ram + userId);
  },

  markAdopted: function(adopters, account) {
    /*
     * Replace me...
     */
  },

  getUrlParameter: function(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
