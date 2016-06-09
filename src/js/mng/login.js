$(onReady);
function onReady() {
    
}
function onFailure(error) {
  console.log(error);
}

var renderTimer = 0;
function renderButton() {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email openid',
    'height': 50,
    'longtitle': true,
    'onsuccess': onSignIn,
    'onfailure': onFailure
  });
  renderTimer = setTimeout(checkRenderButton, 30);
}
function checkRenderButton() {
  if ($(".abcRioButton").css("width"))
    $(".abcRioButton").css("width", "100%");
  else
    renderTimer = setTimeout(checkRenderButton, 30);   
}

function onSignIn(googleUser) {
  //scope = 'email profile openid'
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
  var id_token = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + id_token);

  //location.replace()
}