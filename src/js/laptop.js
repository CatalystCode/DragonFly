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

    $.get("http://mdfinancial-backend.azurewebsites.net/api/auth", function(users) {
      for(let user of users) {
        $('#userIdSelect')
          .append($('<option>', {
          value: user.id,
          text: user.displayName,
        }));
      }
    });

    return App.initWeb3();
  },

  initAddLaptop: function() {
    $("#page-title").text("Add Laptop");
  },

  initEditLaptop: function() {
    $("#page-title").text("Edit Laptop");

    var id = App.getUrlParameter('id');

    Hardware.getDevice(id).then(function(result){
      // get the laptop details from blockchain

      // [ "serial", "assetTag", 0, 0, "userId"]
      var laptop = {
        serialNumber: result[0],
        assetTag: result[1],
        ram: result[2],
        hardDrive: result[3],
        userId: result[4]
      };  
    });

    $("#serialNumberInput").val(laptop.serialNumber);
    $("#assetTagInput").val(laptop.assetTag);
    $("#hardDriveInput").val(laptop.hardDrive);
    $("#ramInput").val(laptop.ram);
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

    if(App.mode == "edit") {
      
    } else {
      Hardware.newDevice(serialNumber, assetTag, ram, hardDrive).then(function(contract){
        Hardware.assignToUser(contract.address, userId);
        $.post( "http://mdfinancial-backend.azurewebsites.net/api/assets", { address: contract.address } );
      });
    }

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
