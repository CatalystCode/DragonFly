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
            var resp = JSON.parse(response)
            console.log(resp);
            for(var x =0; x < resp.length; x++) {

            }
        },
        error: function (xhr, status) {
            alert("error");
        }
    });

    $.getJSON('../laptops.json', function(data) {
      for (i = 0; i < data.length; i ++) {
        App.loadLaptop(null, data[i])
      }
    });

    $(document).on('click', '.btn-edit', App.handleAddLaptop);
  },

  loadLaptop: function(address, laptop) {
    // get the laptop details from blockchain

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
    laptopTemplate.find('.btn-edit').attr('data-id', laptop.serialNumber);

    laptopsRow.append(laptopTemplate.html());
  },

  handleAddLaptop: function() {
    event.preventDefault();

    var laptopId = parseInt($(event.target).data('id'));
    window.location = "laptop.html?mode=edit&id=" + laptopId;
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
