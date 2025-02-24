// Connexion à mysql
const mysql2 = require("mysql2");
const bcrypt = require("bcrypt");

const connection = mysql2.createConnection({
  port: "6033",
  host: "localhost",
  user: "root",
  password: "root",
  database: "secured_webshop", // dans la base de données secured_webshop
});

// Création de la table t_users
const createUserTable = `
    CREATE TABLE IF NOT EXISTS t_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// Exécution de la requête SQL pour créer la table
connection.query(createUserTable, (err, results, fields) => {
  if (err) {
    console.error("Error creating table:", err.stack);
    return;
  }
  console.log("Table t_users created or already exists.");
});

// Fonction pour ajouter un utilisateur
const addUser = async (username, email, password) => {
  try {
    // Hacher le mot de passe avant de le sauvegarder
    const hashedPassword = await bcrypt.hash(password, 10);

    // Requête SQL pour insérer un utilisateur
    const query = `
      INSERT INTO t_users (username, email, password) 
      VALUES (?, ?, ?)
    `;

    // Exécution de la requête
    connection.query(
      query,
      [username, email, hashedPassword],
      (err, results) => {
        if (err) {
          console.error(
            "Erreur lors de l'insertion de l'utilisateur:",
            err.stack
          );
          return;
        }
        console.log("Utilisateur ajouté avec succès:", results);
      }
    );
  } catch (error) {
    console.error("Erreur lors du hachage du mot de passe:", error);
  }
};

// Exemple d'ajout d'un utilisateur
//addUser("john_doe", "john.doe@example.com", "motdepasse123");

module.exports = connection;
connection.end();
