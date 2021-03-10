let cookie = document.cookie;
let admin = 0;
let currVal = document.getElementById("count_per_page").value;
let key = getCookie("session");

function initPag() {
  let data = {
    list: 1,
    count:currVal,
  };
 sendRequest("getuserlist", data, function(result){
  drawData(result);
 })
}


if (key) {
  sendRequest(
    "chekUserSession",
    {
      key: key,
    },
    function (result) {
      console.log(result);
      if (result.error && !result.login) {
        document.cookie = "session=;path=/";
        window.location.replace("/");
      } else {
        document.getElementById(
          "user-info"
        ).innerHTML = `Hello ${result.login}!<br>`;

        admin = result.admin;
        initPag();


        //updateGamesTable();
      }
    }
  );
} else {
  window.location.replace("/");
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}



$("#Log_Out").click(function () {
  document.cookie = "session=;path=/";
  window.location.replace("/");
});

function sendRequest(adrees, data, callback) {
  $.ajax({
    global: false,
    type: "POST",
    url: `/${adrees}`,
    dataType: "json",
    data: data,
    success: function (result) {
      return callback(result);
    },
    error: function (request, status, error) {
      console.log(error);
    },
  });
}

function updateGamesTable() {
  sendRequest(
    "getuserlist",
    {
      key: key,
    },
    function (result) {
      console.log(result);
      
      

      console.log(result);
    }
  );
}




function drawPagin(data) {
  console.log(data);

  let count = data.count;
  let outHtml = ""

  for (let i = 1; i <= count; i++) {
    if(data.currVal == i){
      outHtml += `<li class="page-item active"><a class="page-link">${i}</a></li>`;
    }else{
      outHtml += `<li class="page-item"><a class="page-link">${i}</a></li>`;
    }

  }

  document.getElementById("pagination").innerHTML = outHtml;
  $(".page-item").click(function (event) {
    event.preventDefault();
    let data = {
      list: event.target.innerHTML,
      count:currVal,
    };
    sendRequest("getuserlist", data, function(result){
      drawData(result);
     })
  });
}


document.getElementById("count_per_page").onchange = function (event) {
  currVal = document.getElementById("count_per_page").value;
  initPag();
};

function drawData(result){
  drawPagin(result);
  if (result.array.length === 0) {
    document.getElementById("gamelist").innerHTML = "<p>Тут ничего нет</p>";
  } else {
    let out;
    let rarray = result.array;
    if (admin === 1) {
      out = `<table id="customers">
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Satus</th>
        <th>Action</th>
      </tr>`;
    } else {
      out = `<table id="customers">
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Satus</th>
      </tr>`;
    }
    for (let i = 0; i < rarray.length; i++) {
      out += `<tr>`;
      out += `    <td>${rarray[i].login}</td>`;
      if (rarray[i].admin) {
        out += `    <td>Admin</td>`;
      } else {
        out += `    <td>User</td>`;
      }
      if (rarray[i].locked) {
        out += `    <td>Disabled</td>`;
      } else {
        out += `    <td>Enabled</td>`;
      }
      if (admin === 1) {
        if (rarray[i].locked) {
          out += `    <td><button class = "unlock" value = '{"login":"${rarray[i].login}", "act":0}'>Unlock</button></td>`;
        } else {
          out += `    <td><button class = "unlock" value = '{"login":"${rarray[i].login}", "act":1}'>Lock</button></td>`;
        }
      }
      out += `</tr>`;
    }
    out += `</table>`;
    document.getElementById("gamelist").innerHTML = out;

    $(".unlock").click(function (event) {
      console.log(event.target.value);
      let out = JSON.parse(event.target.value);
      sendRequest(
        "changeStatus",
        {
          login: out.login,
          status: out.act,
        },
        function (result) {
          initPag();
        }
      );
    });
  }
}