const express = require("express");
const app = express();
const port = 3001;
var bodyParser = require("body-parser");
var CryptoJS = require("crypto-js");
const router = require("./router");
const config = require("config");
const sql = require("./sql");
request = require('request');
const key = config.get("key");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);
app.use(bodyParser.json());
app.use("/public", express.static("public"));

app.post("/auth", async (req, res) => {
  if (req.body.login && req.body.password) {
    sql.auth(
      req.body.login,
      req.body.password,
      "users",
      function (error, results) {
        if (error) {
          res.send('{"error":"Логин/пароль неверние"}');
        } else {
          if (results.length === 0) {
            res.send('{"error":"Логин/пароль неверние"}');
          } else {
            console.log(results);
            if(results[0].locked === 1){
              res.send(`{"error":"Пользователь заблокирован"}`);
            }else{
              res.send(
                `{"session":"${CryptoJS.HmacSHA256(req.body.login, key)}"}`
              );
            }

          }
        }
      }
    );
  }
});

app.post("/register", async (req, res) => {
  if(req.body['g_recaptcha_response'] === undefined || req.body['g_recaptcha_response'] === '' || req.body['g_recaptcha_response'] === null)
  {
    return res.json({"error" : "something goes to wrong"});
  }
  const secretKey = "6LfR8n0aAAAAAKjZz-l7dJ2CjdBSwAA6FNIlH1Qb";

  const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g_recaptcha_response'] + "&remoteip=" + req.connection.remoteAddress;

  request(verificationURL,function(error,response,body) {
    console.log(body);
    body = JSON.parse(body);

    if(body.success !== undefined && !body.success) {
      return res.json({"error" : "Failed captcha verification"});
    }
    if (
      req.body.login &&
      req.body.login !== "" &&
      req.body.password !== null &&
      req.body.password &&
      req.body.psw_repeat !== null &&
      req.body.psw_repeat &&
      req.body.password === req.body.psw_repeat
    ) {
      sql.register(
        req.body.login,
        req.body.password,
        "users",
        null,
        function (error, result) {
          if (error) {
            res.send(`{"error":"${error}"}`);
          } else {
            res.send(`{"session":"${CryptoJS.HmacSHA256(req.body.login, key)}"}`);
          }
        }
      );
    } else {
      res.send('{"error":"error"}');
    }
  });



});

app.post("/chekUserSession", async (req, res) => {
  if (req.body.key) {
    sql.getUserByKey(req.body.key, function (error, results) {
      if (error) {
        res.send(`{"error":"${error}"}`);
      } else {
        if(results.locked === 1){
          res.send(`{"error":"Locked"}`);
        }else{
          res.send(results);
        }
      }
    });
  }
});
app.post("/getuserlist", async (req, res) => {
    sql.getUserList(async function (error, result) {
      if (error) {
        res.send(`{"error":"${error}"}`);
      } else {


        let temp = await openList(req.body.list, req.body.count, result);
        let count = Math.ceil(result.length / req.body.count);
        let out = {
          type: "changeList",
          count: count,
          array: temp,
          currVal:req.body.list
        };
        res.send(out);

      }
    });
});


app.post("/changeStatus", async (req, res) => {
    sql.changeLock(req.body.login, req.body.status, function (error, result) {
      if (error) {
        res.send(`{"error":"${error}"}`);
      } else {
        res.send(`{"result":"${result}"}`);
      }
    });
});


app.post("/deleteUser", async (req, res) => {
  console.log(req.body.login)
  sql.deleteUser(req.body.login, function (error, result) {
    if (error) {
      res.send(`{"error":"${error}"}`);
    } else {
      res.send(`{"result":"${result}"}`);
    }
  });
});

async function openList(list, currVal, carray) {
  let out = [];
  let end = list * currVal;

  if (end > carray.length) {
    end = carray.length;
  }
  let begin = (list - 1) * currVal;

  console.log(begin + " " + end);
  for (let i = begin; i < end; i++) {
    console.log("end " + carray[i]);
    out.push(carray[i]);
  }

  return out;
}

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


app.post('/captcha', function(req, res) {
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
  {
    return res.json({"responseError" : "something goes to wrong"});
  }
  const secretKey = "6LfR8n0aAAAAAKjZz-l7dJ2CjdBSwAA6FNIlH1Qb";

  const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

  request(verificationURL,function(error,response,body) {
    console.log(body);
    body = JSON.parse(body);

    if(body.success !== undefined && !body.success) {
      return res.json({"responseError" : "Failed captcha verification"});
    }
    res.json({"responseSuccess" : "Sucess"});
  });
});