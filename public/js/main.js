$(document).ready(function() {
  $('.deleteUser').on('click', deleteUser);
});

function deleteUser() {
  // alert(1);
  var confirmation = confirm('Are you sure?');

  if(confirmation) {
    // alert(1);
    $.ajax({
      type: 'DELETE',
      url: '/users/delete/'+$('deleteUser').data('id')
    }).done(function(response) {
      window.location.replace('/');
    });
  }
  else {
    return false;
  }
}