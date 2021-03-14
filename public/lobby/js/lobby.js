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
        var date1 = new Date();
        var date2 = new Date(Date.parse(result.regDate));

        document.getElementById("regTime").innerHTML = getNiceTime(date2, date1, 20)
      }
    }
  );
} else {
  window.location.replace("/");
}
Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
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
        <th>Lock Users</th>
        <th>Delete Users</th>
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
        out += `    <td><button class = "delete" value = '{"login":"${rarray[i].login}", "act":0}'>Delete</button></td>`;
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


    $(".delete").click(function (event) {
      console.log(event.target.value);
      let out = JSON.parse(event.target.value);
      sendRequest(
        "deleteUser",
        {
          login: out.login,
        },
        function (result) {
          initPag();
        }
      );
    });
  }
}


function getNiceTime(fromDate, toDate, levels, prefix){
  var lang = {
          "date.past": "{0} ago",
          "date.future": "in {0}",
          "date.now": "now",
          "date.year": "{0} year",
          "date.years": "{0} years",
          "date.years.prefixed": "{0} years",
          "date.month": "{0} month",
          "date.months": "{0} months",
          "date.months.prefixed": "{0} months",
          "date.day": "{0} day",
          "date.days": "{0} days",
          "date.days.prefixed": "{0} days",
          "date.hour": "{0} hour",
          "date.hours": "{0} hours",
          "date.hours.prefixed": "{0} hours",
          "date.minute": "{0} minute",
          "date.minutes": "{0} minutes",
          "date.minutes.prefixed": "{0} minutes",
          "date.second": "{0} second",
          "date.seconds": "{0} seconds",
          "date.seconds.prefixed": "{0} seconds",
      },
      langFn = function(id,params){
          var returnValue = lang[id] || "";
          if(params){
              for(var i=0;i<params.length;i++){
                  returnValue = returnValue.replace("{"+i+"}",params[i]);
              }
          }
          return returnValue;
      },
      toDate = toDate ? toDate : new Date(),
      diff = fromDate - toDate,
      past = diff < 0 ? true : false,
      diff = diff < 0 ? diff * -1 : diff,
      date = new Date(new Date(1970,0,1,0).getTime()+diff),
      returnString = '',
      count = 0,
      years = (date.getFullYear() - 1970);
  if(years > 0){
      var langSingle = "date.year" + (prefix ? "" : ""),
          langMultiple = "date.years" + (prefix ? ".prefixed" : "");
      returnString += (count > 0 ?  ', ' : '') + declOfNum(years, ["год","года","лет"]);
      count ++;
  }
  var months = date.getMonth();
  if(count < levels && months > 0){
      var langSingle = "date.month" + (prefix ? "" : ""),
          langMultiple = "date.months" + (prefix ? ".prefixed" : "");
      returnString += (count > 0 ?  ', ' : '') + declOfNum(months, ["месяц","месяца","месяцев"]);
      count ++;
  } else {
      if(count > 0)
          count = 99;
  }
  var days = date.getDate() - 1;
  if(count < levels && days > 0){
      var langSingle = "date.day" + (prefix ? "" : ""),
          langMultiple = "date.days" + (prefix ? ".prefixed" : "");
      returnString += (count > 0 ?  ', ' : '') + declOfNum(days, ["день","дня","дней"]);
      count ++;
  } else {
      if(count > 0)
          count = 99;
  }
  var hours = date.getHours();
  if(count < levels && hours > 0){
      var langSingle = "date.hour" + (prefix ? "" : ""),
          langMultiple = "date.hours" + (prefix ? ".prefixed" : "");
      returnString += (count > 0 ?  ', ' : '') + declOfNum(hours, ["час","часа","часов"]);
      count ++;
  } else {
      if(count > 0)
          count = 99;
  }
  var minutes = date.getMinutes();
  if(count < levels && minutes > 0){
      var langSingle = "date.minute" + (prefix ? "" : ""),
          langMultiple = "date.minutes" + (prefix ? ".prefixed" : "");
      returnString += (count > 0 ?  ', ' : '') + declOfNum(minutes, ["минуту","минуты","минут"]);
      count ++;
  } else {
      if(count > 0)
          count = 99;
  }
  var seconds = date.getSeconds();
  if(count < levels && seconds > 0){
      var langSingle = "date.second" + (prefix ? "" : ""),
          langMultiple = "date.seconds" + (prefix ? ".prefixed" : "");
      returnString += (count > 0 ?  ', ' : '') + declOfNum(seconds, ["секунду","секунды","секунд"]);
      count ++;
  } else {
      if(count > 0)
          count = 99;
  }
  if(prefix){
      if(returnString == ""){
          returnString = langFn("date.now");
      } else if(past)
          returnString = langFn("date.past",[returnString]);
      else
          returnString = langFn("date.future",[returnString]);
  }
  return returnString;
}



        function declOfNum(n, text_forms) {  
          n = Math.abs(n) % 100; var n1 = n % 10;
          if (n > 10 && n < 20) { return n + " " + text_forms[2]; }
          if (n1 > 1 && n1 < 5) { return n + " " + text_forms[1]; }
          if (n1 == 1) { return n + " " + text_forms[0]; }
          return n + " " + text_forms[2];
      }