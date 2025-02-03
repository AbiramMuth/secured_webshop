const express = require("express");

const router = express.Router();
const controller = require("../controllers/UserController");
router.get("/", controller.get); // localhost/user
router.get("/login", controller.login); // localhost/user/login
router.get("/register", controller.register); // localhost/user/register
router.get("/admin", controller.admin); // localhost/user/admin

// quand on appuie sur le bouton pour se connecter, affiche la page user
router.post("/", controller.post);

module.exports = router;
