const jwt = require("jsonwebtoken"); // Importation de la bibliothèque jsonwebtoken pour générer des tokens
const bcrypt = require("bcryptjs"); // Importation de bcryptjs pour hacher et comparer les mots de passe
const db = require("../database"); // Importation de la connexion à la base de données
const SECRET_KEY = "remplace_par_ton_secret"; // Clé secrète utilisée pour signer le token (remplacer par une vraie clé)

module.exports = {
  // Route pour afficher la page de connexion
  get: (req, res) => {
    res.sendFile("login.html", { root: "./view" }); // Envoie le fichier login.html situé dans le dossier ./view
  },

  // Route pour afficher la page d'inscription
  signupPage: (req, res) => {
    res.sendFile("signup.html", { root: "./view" }); // Envoie le fichier signup.html situé dans le dossier ./view
  },

  // Route pour afficher la page d'accueil (généralement pour l'utilisateur)
  home: (req, res) => {
    res.sendFile("index.html", { root: "./view" }); // Envoie le fichier index.html
  },

  // Route pour afficher la page d'administration (pour les admins)
  homeAdmin: (req, res) => {
    res.sendFile("admin.html", { root: "./view" }); // Envoie le fichier admin.html
  },

  profil: (req, res) => {
    res.sendFile("profil.html", { root: "./view" });
  },

  // Route pour gérer la déconnexion de l'utilisateur
  logout: (req, res) => {
    req.session.destroy((err) => {
      // Détruit la session de l'utilisateur
      if (err) return res.status(500).send("Erreur lors de la déconnexion."); // Si une erreur survient, renvoie une erreur 500
      res.redirect("/user"); // Sinon, redirige l'utilisateur vers la page de connexion
    });
  },

  // Route pour gérer la connexion de l'utilisateur
  login: (req, res) => {
    const { email, password } = req.body; // Récupère l'email et le mot de passe depuis le corps de la requête

    // Vérifie que l'email et le mot de passe sont fournis
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email et mot de passe obligatoires !" }); // Si manquant, renvoie une erreur 400
    }

    // Effectue une requête SQL pour vérifier si l'utilisateur existe dans la base de données
    const query = "SELECT * FROM t_users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err) return res.status(500).json({ message: "Erreur serveur." }); // Si une erreur se produit lors de la requête SQL, renvoie une erreur serveur
      if (results.length === 0)
        return res.status(401).json({ message: "Utilisateur non trouvé." }); // Si aucun utilisateur n'est trouvé, renvoie une erreur 401

      const user = results[0]; // Récupère les données de l'utilisateur
      const match = await bcrypt.compare(password, user.password); // Compare le mot de passe fourni avec celui stocké (haché) dans la base de données
      if (!match)
        return res.status(401).json({ message: "Mot de passe incorrect" }); // Si les mots de passe ne correspondent pas, renvoie une erreur 401

      // Si la connexion est réussie, génère un token JWT pour l'utilisateur
      const token = jwt.sign(
        { email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: "1h" }
      ); // Le token expire après 1 heure
      res.json({
        success: true,
        message: "Connexion réussie",
        token,
        redirect: user.role === 1 ? "/admin.html" : "/index.html",
      }); // Renvoie le token et la redirection appropriée en fonction du rôle (admin ou utilisateur)
      res.cookie("token", token, {});
      res.cookie("username", username, {});
    });
  },

  // Route pour gérer l'inscription d'un nouvel utilisateur
  signup: async (req, res) => {
    const { email, password, role } = req.body; // Récupère l'email, le mot de passe et le rôle depuis le corps de la requête

    // Vérifie que l'email et le mot de passe sont fournis
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email et mot de passe obligatoires !" }); // Si manquant, renvoie une erreur 400
    }

    const userRole = role === "admin" ? 1 : 0; // Définit le rôle de l'utilisateur (1 pour admin, 0 pour utilisateur)

    try {
      // Hache le mot de passe avec bcrypt avant de le stocker dans la base de données
      const hashedPassword = await bcrypt.hash(password, 10);
      const query =
        "INSERT INTO t_users (email, password, role) VALUES (?, ?, ?)"; // Requête SQL pour insérer un nouvel utilisateur
      db.query(query, [email, hashedPassword, userRole], (err, results) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Erreur lors de l'inscription." }); // Si une erreur se produit lors de l'insertion, renvoie une erreur serveur
        res
          .status(201)
          .json({ success: true, message: "Utilisateur inscrit avec succès" }); // Si l'inscription réussit, renvoie un message de succès
      });
    } catch (err) {
      return res.status(500).json({ message: "Erreur serveur." }); // En cas d'erreur dans le processus de hachage du mot de passe, renvoie une erreur serveur
    }
  },
};
