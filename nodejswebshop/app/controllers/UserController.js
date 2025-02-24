const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Inscription de l'utilisateur
exports.handleregister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Enregistrer l'utilisateur
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Utilisateur créé avec succès !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Connexion de l'utilisateur
exports.handlelogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé !" });
    }

    // Vérifier le mot de passe
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Mot de passe incorrect !" });
    }

    // Générer un Token JWT
    const token = jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", {
      expiresIn: "24h",
    });

    res.status(200).json({ userId: user.id, token });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Page view
exports.login = (req, res) => {
  res.sendFile("public/view/login.html", { root: "." });
};

exports.register = (req, res) => {
  res.sendFile("public/view/register.html", { root: "." });
};
