let keyCount = getCookie("count");
console.log("asdfsdfs");
if (keyCount) {
  keyCount++;
  document.getElementById("count-text").innerHTML = keyCount;
  document.cookie = `count=${keyCount}`;
} else {
    document.getElementById("count-text").innerHTML = 1;
    document.cookie = `count=${1}`;
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
