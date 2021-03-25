let vtocken;
document.getElementById("regbutton").onclick = function (event) {
  event.preventDefault();
  console.log("Testr");
  let login = $("#login").val();
  let password = $("#password").val();
  let psw_repeat = $("#psw-repeat").val();
  if (login === "" || password === "" || psw_repeat === "") {
    document.getElementById("error_msg").innerHTML = "Заполните все поля";
    return;
  }
  if (password !== psw_repeat) {
    document.getElementById("error_msg").innerHTML = "Пароли не совпадают";
    return;
  }
  document.getElementById("error_msg").innerHTML = "";
  $.ajax({
    global: false,
    type: "POST",
    url: "/register",
    dataType: "json",
    data: {
      login: $("#login").val(),
      password: $("#password").val(),
      psw_repeat: $("#psw-repeat").val(),
      g_recaptcha_response: vtocken
    },
    success: function (result) {
      if (result.error === undefined) {
        document.cookie = `session=${result.session}`;
        window.location.replace("/lobby");
      } else {
        document.getElementById("error_msg").innerHTML = result.error;
        grecaptcha.execute('6LfR8n0aAAAAAArhkIsAhop8XexQzefcDqeJMpH5', {action:'validate_captcha'})
        .then(function(token) {
          console.log(token);
  // add token value to form
  vtocken = token;
});
      }

      console.log(result.error);
    },
    error: function (request, status, error) {
      console.log(error);
    },
  });
};

grecaptcha.ready(function() {
  // do request for recaptcha token
  // response is promise with passed token
      grecaptcha.execute('6LfR8n0aAAAAAArhkIsAhop8XexQzefcDqeJMpH5', {action:'validate_captcha'})
                .then(function(token) {
                  console.log(token);
          // add token value to form
          vtocken = token;
      });
  });