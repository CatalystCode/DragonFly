App = {
  web3Provider: null,
  contracts: {},
  mode: "add",

  init: function() {
    // figure out the page state
    $(document).on('click', '.btn-submit', App.handleSubmit);

    $.get("http://mdfinancial-backend.azurewebsites.net/api/auth", function(users) {
      for(let user of users) {
        $('#userIdSelect')
          .append($('<option>', {
          value: user.displayName,
          text: user.displayName,
        }));
      }

      var mode = App.getUrlParameter('mode');
      switch(mode) {
        case "edit":
        App.initEditLaptop();
        break;
        default:
        App.initAddLaptop();
        break;
      }
    });
  },

  initAddLaptop: function() {
    $("#page-title").text("Add Laptop");
    App.mode = "add";
  },

  initEditLaptop: function() {
    $("#page-title").text("Edit Laptop");
    App.mode = "edit";

    var address = App.getLaptopContractAddress();

    Hardware.getDevice(address).then(function(result){
      // get the laptop details from blockchain

      // [ "serial", "assetTag", 0, 0, "userId"]
      var laptop = {
        serialNumber: result[0],
        assetTag: result[1],
        ram: result[2],
        hardDrive: result[3],
        userId: result[4]
      };

      console.log(laptop)
      $("#serialNumberInput").val(laptop.serialNumber);
      $("#serialNumberInput").prop('disabled', true);
      $("#assetTagInput").val(laptop.assetTag);
      $("#assetTagInput").prop('disabled', true);
      $("#hardDriveInput").val(laptop.hardDrive);
      $("#ramInput").val(laptop.ram);
      $("#userIdSelect").val(laptop.userId);
    });
  },

  getLaptopContractAddress() {
    return decodeURIComponent(App.getUrlParameter('id'));
  },

  handleSubmit: function() {
    event.preventDefault();

    var serialNumber = $("#serialNumberInput").val();
    var assetTag = $("#assetTagInput").val();
    var hardDrive = $("#hardDriveInput").val();
    var ram = $("#ramInput").val();
    var userId = $('#userIdSelect').find(":selected").text();

    if(App.mode == "edit") {
      var address = App.getLaptopContractAddress();
      Hardware.updateHardware(address, ram, hardDrive).then(function(contract){
        Hardware.assignToUser(address, userId);
      });
    } else {
      Hardware.newDevice(serialNumber, assetTag, ram, hardDrive).then(function(contract){
        Hardware.assignToUser(contract.address, userId);
        // add the laptop to mongodb
        $.post( "http://mdfinancial-backend.azurewebsites.net/api/assets", { address: contract.address } );
      });
    }

    console.log(serialNumber + assetTag + hardDrive + ram + userId);
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
