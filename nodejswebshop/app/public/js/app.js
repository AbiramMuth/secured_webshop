const mysql = require("mysql2");

const connection = mysql.createConnection({
  port: "6033",
  host: "localhost",
  user: "root",
  password: "root",
  database: "secured_webshop",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Database");
});
