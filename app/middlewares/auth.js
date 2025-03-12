const jwt = require("jsonwebtoken"); // Importation de la bibliothèque jsonwebtoken pour vérifier les tokens
const SECRET_KEY = "remplace_par_ton_secret"; // La clé secrète utilisée pour vérifier la validité du token (remplacer par une clé secrète plus sécurisée)

module.exports = (req, res, next) => {
  // Ce middleware sera exécuté pour toutes les routes protégées

  const token = req.headers["authorization"]?.split(" ")[1];

  // Si le token n'est pas présent dans l'en-tête
  if (!token) {
    // Renvoie une erreur 401, si aucun token n'est trouvé
    return res.status(401).json({
      message: "Vous devez être connecté pour accéder à cette page !",
    });
  }

  // Si le token est présent, on le vérifie avec la clé secrète
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    // Si le token est invalide ou expiré
    if (err) {
      // Renvoie une erreur 401, avec un message d'erreur
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }

    // Si le token est valide, les données du token (comme l'email et le rôle) sont ajoutées à la requête
    req.user = decoded;
    next();
  });
};
