var currentDate = new Date();
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var localeString = currentDate.toLocaleDateString('uk', options);
console.log(localeString);
document.getElementById("currdate").innerHTML = localeString;