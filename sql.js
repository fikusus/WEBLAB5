var CryptoJS = require("crypto-js");
var mysql = require("mysql");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'test'
});

let SQLErrorMgs = "Ошибка, поробуйте позже";

const config = require('config');
const key =  config.get("key");

connection.connect();

let sql = {
  auth: (login, password, tablename, callback) => {
    var sql = `SELECT * FROM ${tablename} WHERE login = '${login}' AND password = '${CryptoJS.HmacSHA256(
      password,
      key
    )}' ;`;

    connection.query(sql, function (err, results) {
      if (err) {
        if (err.code === "ER_NO_SUCH_TABLE") {
          return callback("Логин/пароль неверние", null);
        } else {
          return callback(SQLErrorMgs, null);
        }
      } else {
        return callback(null, results);
      }
    });
  },

  register: (login, password, tablename,userData, callback) => {
    let sql_find_user = `SELECT COUNT(*) as solution FROM ${tablename} where login = '${login}';`;
    let sql_insert_user = `INSERT INTO ${tablename} (login, password, sessionkey) values ('${login}', '${CryptoJS.HmacSHA256(
      password,
      key
    )}', '${CryptoJS.HmacSHA256(login, key)}')`;

      console.log(sql_insert_user);

    let sql_create_user_table = `CREATE TABLE ${tablename} (
        sessionkey VARCHAR(128) UNIQUE,
        login VARCHAR(128) PRIMARY KEY,
        password VARCHAR(128) NOT NULL,
        locked BOOLEAN DEFAULT 0,
        admin BOOLEAN DEFAULT 0
    )`;
    connection.query(sql_find_user, function (error, results, fields) {
      if (error) {
        if (error.code === "ER_NO_SUCH_TABLE") {
          connection.query(
            sql_create_user_table,
            function (error, results, fields) {
              if (error) {
                return callback(SQLErrorMgs, null);
              } else {
                connection.query(
                  sql_insert_user,
                  function (error, results, fields) {
                    if (error) {
                      return callback(SQLErrorMgs, null);
                    } else {
                      return callback(null, "OK");
                    }
                  }
                );
              }
            }
          );
        } else {
          return callback(SQLErrorMgs, null);
        }
      } else {
        console.log(results);
        if (results[0].solution === 1) {
          callback("Имя пользователя занято", null);
        } else {
          connection.query(sql_insert_user, function (error, results, fields) {
            if (error) {
              return callback(SQLErrorMgs, null);
            } else {
              return callback(null, "OK");
            }
          });
        }
      }
    });
  },

  getUserByKey: (sessionkey, callback) => {
    var sql = `SELECT *  FROM users WHERE sessionkey = '${sessionkey}';`;

    connection.query(sql, function (error, results) {
      if (error || !results[0]) {
        return callback(SQLErrorMgs, null);
      } else {
        return callback(null, results[0]);
      }
    });
  },

  getUserList: (callback) => {
    var sql = `SELECT *  FROM users;`;

    connection.query(sql, function (error, results) {
      if (error) {
        return callback(SQLErrorMgs, null);
      } else {
        return callback(null, results);
      }
    });
  },

  changeLock: (login, status,callback) => {
    var sql = `Update users set locked = ${status} where login = '${login}';`;
    console.log(sql);
    connection.query(sql, function (error, results) {
      if (error) {
        return callback(SQLErrorMgs, null);
      } else {
        return callback(null, "OK");
      }
    });
  },
};

module.exports = sql;
