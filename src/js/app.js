App = {

  init: function() {

    // Load laptops.
    /*
    $.get( "http://mdfinancial-backend.azurewebsites.net/api/assets", function(laptops) {
      console.log(laptops);
    });
    */
    $.ajax({
        url: "http://mdfinancial-backend.azurewebsites.net/api/assets",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function (response) {
            for(var x =0; x < response.length; x++) {
              var addr = response[x].address;
              Hardware.getDevice(addr).then(function(result){
                // get the laptop details from blockchain

                // [ "serial", "assetTag", 0, 0, "userId"]
                var laptop = {
                  serialNumber: result[0],
                  assetTag: result[1],
                  userId: result[4],
                  address: addr,
                };  

                App.loadLaptop(laptop);

              }, function(err){console.log(err);});
            }
        },
        error: function (xhr, status) {
            alert("error");
        }
    });

    $(document).on('click', '.btn-edit', App.handleAddLaptop);
  },

  loadLaptop: function(laptop) {

    // load the template
    var laptopsRow = $('#laptopsRow');
    var laptopTemplate = $('#laptopTemplate');

    var r = Math.floor((Math.random() * 100) + 1);
    var img = "/images/SurfaceBook_Office_V2.jpg";
    if(r % 3 == 0) {
      img = "/images/hp.png";
    } else if(r % 2 == 0) {
      img = "/images/mbp.jpg";
    }

    laptopTemplate.find('.panel-title').text(laptop.assetTag);
    laptopTemplate.find('img').attr('src', img);
    laptopTemplate.find('.laptop-asset-tag').text(laptop.assetTag);
    laptopTemplate.find('.laptop-user-id').text(laptop.userId);
    laptopTemplate.find('.btn-edit').attr('data-id', laptop.address);

    laptopsRow.append(laptopTemplate.html());
  },

  handleAddLaptop: function() {
    event.preventDefault();

    var laptopId = encodeURIComponent($(event.target).data('id'));
    window.location = "laptop.html?mode=edit&id=" + laptopId;
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
