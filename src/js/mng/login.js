$(onReady);
function onReady() {
    //console.log(vpath);
}
function onFailure(error) {
  console.log(error);
  pageAlert.showError({
    "title": "登入錯誤",
    "text" : error.reason
  });
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
  console.log('ID Token: ' + id_token);

  pageAlert.show({
    'title':'登入驗證中',
    'type':'info'
  });

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/jason/api/tokensignin');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    console.log('Signed in as: ' + xhr.responseText);
    var _obj = $.parseJSON(xhr.responseText);
    if (_obj.status != 'OK') {
      signOut();
      pageAlert.showError({"title":_obj.message});
    } else {
      location.replace(vpath + '/mng/users/');
    }
  };
  xhr.send('idtoken=' + id_token);
}
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}