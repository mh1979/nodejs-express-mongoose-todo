$(document).ready(function () {

  // confirmations
  $('.confirm').submit(function (e) {
    e.preventDefault();
    var self = this;
    var msg = 'Are you sure?';
    bootbox.confirm(msg, 'cancel', 'Yes! I am sure', function (action) {
      if (action) {
        $(self).unbind('submit');
        $(self).trigger('submit');
      }
    });
  });

  $('.todo').on('click', function () {
    $('.operation').hide();
    $('.todotitle').removeClass('highlight');
    $(this).closest('.todoitem').find('.operation').show();
    $(this).find('.todotitle').addClass('highlight');
  });

  var showEditForm = function () {
    $('form.edit').hide();
    $(this).closest('li.todoitem').find('.operation').hide();
    $(this).closest('.todoitem').find('form.edit').show();
    $(this).closest('.todoitem').find('#datetimepicker').datetimepicker({
      format: 'yyyy/MM/dd hh:mm:ss',
      language: 'en'
    });
  };

  $('.todo').on('dblclick', showEditForm);
  $('a.edit').on('click', showEditForm);

  $('a.done').on('click', function() {
    var url = $(this).attr('data-href');
    var id = $(this).closest('li.todoitem').data('id');
    // alert(id);
    $.ajax({
      url: url,
      type: "get",
      success: function(data) {
        $('li#'+id).find('.todotitle').toggleClass('done');
      }
    });
  });

  $('a#cancel').click(function() {
    $(this).closest('form.edit').hide();
  });

  $('a#savechanges').click(function() {
    $(this).closest('form.edit').hide();
    var id = $(this).closest('li.todoitem').data('id');
    var url = '/todos/' + id;
    var value = $(this).closest('form.edit').serialize();
    var title = $(this).closest('form.edit').find('input#title').val();

    $.ajax({
      url:url,
      type: "put",
      data: value,
      success: function(){
        $("li#"+id).find('.todotitle').text(title);
      },
      error: function() {
        $('li#'+id).find('.todotitle').text(title);
      }
    });
  });

});
