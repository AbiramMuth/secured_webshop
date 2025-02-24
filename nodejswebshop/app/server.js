const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");
const connection = require("./db/db");

const sslOptions = {
  key: fs.readFileSync("./privkey.key"),
  cert: fs.readFileSync("./certificate.crt"),
};
// Initialisation de l'application express
const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoute = require("./routes/User");
app.use("/", userRoute);

// Lancement du serveur
https.createServer(sslOptions, app).listen(443, () => {
  console.log("Server running on port https://localhost/user/login");
});

/*
// exports.connection = connection;
connection.connect((err) => {
  if (err) throw err;
  console.log("la base de données est connectée");
});
*/
