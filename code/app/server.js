// Importer les modules nécessaires
const express = require("express");
const fs = require("fs");
const https = require("https");
const path = require("path");
const bcrypt = require("bcryptjs"); // Pour comparer et hacher les mots de passe
const cookieParser = require("cookie-parser"); // Pour lire les cookies
const session = require("express-session");
const db = require("./database"); // Connexion à la base de données

const privateKey = fs.readFileSync("../privkey.key", "utf8");
const certificate = fs.readFileSync("../certificate.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };

const app = express();
app.use(express.static(path.join(__dirname, "view")));

app.use(
  session({
    secret: "monSuperSecret", // Clé secrète pour signer la session
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Met à true si HTTPS en production
  })
);

app.use(cookieParser()); // Permet à Express de lire les cookies
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Pour traiter les données JSON

const userRoute = require("./routes/User");
app.use("/user", userRoute);

// Route pour récupérer tous les utilisateurs depuis la DB
app.get("/user/admin/users", (req, res) => {
  db.query("SELECT email, role FROM t_users", (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des utilisateurs:", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    res.json(results);
  });
});

// Route pour rechercher un utilisateur par email dans la DB
app.get("/user/admin/users/search", (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: "Email requis" });
  }

  db.query(
    "SELECT email, role FROM t_users WHERE email LIKE ?",
    [`%${email}%`],
    (err, results) => {
      if (err) {
        console.error("Erreur lors de la recherche des utilisateurs:", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }
      res.json(results);
    }
  );
});

// Créer le serveur HTTPS
const httpsServer = https.createServer(credentials, app);

// Démarrage du serveur
httpsServer.listen(443, () => {
  console.log("Server running on https://localhost:443/user");
});
