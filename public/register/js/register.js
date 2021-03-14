
/*document.getElementById("regbutton").onclick = function (event) {
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
    },
    success: function (result) {
      if (result.error === undefined) {
        document.cookie = `session=${result.session}`;
        window.location.replace("/lobby");
      } else {
        document.getElementById("error_msg").innerHTML = result.error;
      }

      console.log(result.error);
    },
    error: function (request, status, error) {
      console.log(error);
    },
  });
};*/

function showResult(text) {
  console.log(text);
  //document.querySelector('#result').innerHTML = text;
}

function handleClick(token) {
  return function() {
      var hello = document.querySelector('#hello').value;
      var data = {
          hello: "hello",
          token: token
      };

      fetch('/send', {
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          method: 'post',
          body: JSON.stringify(data)
      })
          .then(response => response.text())
          .then(text => showResult(text))
          .catch(error => showResult(error));
  }
}

grecaptcha.ready(function() {
  grecaptcha.execute('6LcP8H0aAAAAAH7Q_cQJIl_iRk4M2xzALQWyIXOH', {action: 'demo'})
      .then(function(token) {
          document.querySelector('#regbutton').addEventListener('click', handleClick(token));
      });
});
