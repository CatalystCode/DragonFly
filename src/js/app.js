App = {

  init: function() {
    // Load laptops.
    $.getJSON('../laptops.json', function(data) {
      var laptopsRow = $('#laptopsRow');
      var laptopTemplate = $('#laptopTemplate');

      for (i = 0; i < data.length; i ++) {
        laptopTemplate.find('.panel-title').text(data[i].assetTag);
        laptopTemplate.find('img').attr('src', data[i].picture);
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
