App = {

  init: function() {

    // Load laptops.
    $.getJSON('../laptops.json', function(data) {
      var laptopsRow = $('#laptopsRow');
      var laptopTemplate = $('#laptopTemplate');

      for (i = 0; i < data.length; i ++) {

        var r = Math.floor((Math.random() * 100) + 1);
        var img = "/images/SurfaceBook_Office_V2.jpg";
        if(r % 3 == 0) {
          img = "/images/hp.png";
        } else if(r % 2 == 0) {
          img = "/images/mbp.jpg";
        }

        laptopTemplate.find('.panel-title').text(data[i].assetTag);
        laptopTemplate.find('img').attr('src', img);
        laptopTemplate.find('.laptop-asset-tag').text(data[i].assetTag);
        laptopTemplate.find('.laptop-user-id').text(data[i].userId);
        laptopTemplate.find('.btn-edit').attr('data-id', data[i].serialNumber);

        laptopsRow.append(laptopTemplate.html());
      }
    });

    $(document).on('click', '.btn-edit', App.handleAddLaptop);
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
