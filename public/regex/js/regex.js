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
      console.log(result);
      let max = result.h.length;
      let out = `<table>
      <tr>
        <th>Заголовка</th>
        <th>email</th>
        <th>Ссылки</th>
      </tr>`
      if(max < result.email.length){
        max = result.email.length;
      }

      if(max < result.a.length){
        max = result.ajax.length;
      }


      for(let i = 0;i < max;i++){
        out+="<tr>";
        if(result.h[i]){
          out+=`<th>${result.h[i]}</th>`;
        }else{
          out+=`<th></th>`;
        }

        if(result.email[i]){
          out+=`<th>${result.email[i]}</th>`;
        }else{
          out+=`<th></th>`;
        }

        if(result.a[i]){
          out+=`<th>${result.a[i]}</th>`;
        }else{
          out+=`<th></th>`;
        }
        out+="</tr>";
      }

      out+="</table>";
      document.getElementById("out").innerHTML = out;
      console.log(max);
    },
    error: function (request, status, error) {
      console.log(error);
    },
  });
});

