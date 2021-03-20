console.log(document);
$("document").ready(function () {
  $.ajax({
    type: "POST",
    url: "/regex",
    dataType: "json",
    data: {
      html:  document.documentElement.innerHTML,
    },
    success: function (result) {
      console.log(result.error);
    },
    error: function (request, status, error) {
      console.log(error);
    },
  });
});

