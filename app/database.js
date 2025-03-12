const mysql = require("mysql2");

// Informations de connexion pour la db
const db = mysql.createConnection({
  host: "localhost",
  port: "6033",
  user: "root",
  password: "root",
  database: "secured_webshop",
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la DB:", err);
    return;
  }
  console.log("Connecté à la base de données MySQL");
});

module.exports = db;
