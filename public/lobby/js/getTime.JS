var tamestamp = new Date()
$('document').ready(function(){
document.getElementById("genTime").innerHTML = new Date()-tamestamp + "ms";
});