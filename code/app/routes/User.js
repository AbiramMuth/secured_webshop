const express = require("express");
const router = express.Router();
const controller = require("../controllers/UserController");
const auth = require("../middlewares/auth"); // Middleware pour vérifier si l'utilisateur est authentifié

// Routes publiques - Aucune authentification requise (pas besoin de token)
router.get("/", controller.get); // Route pour afficher la page de connexion
router.get("/signup", controller.signupPage); // Route pour afficher la page d'inscription
router.post("/", controller.login); // Route pour effectuer la connexion (envoie les informations de login)
router.post("/signup", controller.signup); // Route pour enregistrer un nouvel utilisateur
router.post("/login", controller.login); // Route pour se connecter (authentification par login)

// Routes protégées - Nécessitent un token d'authentification
router.get("/home", auth, controller.home); // Route pour accéder à la page d'accueil, accessible uniquement aux utilisateurs authentifiés
router.get("/admin", auth, controller.homeAdmin); // Route pour accéder à l'administration, accessible uniquement aux administrateurs authentifiés
router.get("/logout", controller.logout); // Route pour se déconnecter
router.get("/profil", auth, controller.profil);
router.get("/profile", auth, controller.getProfile);
// Route pour obtenir les informations de session de l'utilisateur authentifié
/*router.get("/session", auth, (req, res) => {
  res.json({ email: req.user.email, role: req.user.role });  // Renvoie les données de l'utilisateur connecté*/

module.exports = router;
