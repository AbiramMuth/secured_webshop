const jwt = require("jsonwebtoken");

// middleware d'authentification
module.exports = (req, res, next) => {
  // vérifie si le token est valide
  try {
    const token = req.headers.authorization.split(" ")[1]; // récupère le token dans le header de la requête
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // décode le token (permet de vérifier la validité du token)
    const userId = decodedToken.userId; // récupère l'id de l'utilisateur
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
