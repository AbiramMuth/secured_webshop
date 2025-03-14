const jwt = require("jsonwebtoken");
const SECRET_KEY = "remplace_par_ton_secret"; // Clé secrète

module.exports = (req, res, next) => {
  // Récupère le token depuis les cookies
  const token = req.cookies.token;  

  if (!token) {
    return res.status(401).json({
      message: "Vous devez être connecté pour accéder à cette page !",
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }

    req.user = decoded; // Stocke les infos du token (ex: email, rôle) dans req.user
    next();
  });
};
