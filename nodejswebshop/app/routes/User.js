const express = require("express");
//const auth = require("auth");
const router = express.Router();
const controller = require("../controllers/UserController");

// localhost/user
router.post("/register", controller.handleregister); // localhost/user/register
router.post("/login", controller.handlelogin); // localhost/user/login

router.get("/register", controller.register); // localhost/user/register
router.get("/login", controller.login); // localhost/user/login

//router.get("/admin", controller.admin); // localhost/user/admin

// quand on appuie sur le bouton pour se connecter, affiche la page user
// router.post("/", controller.post);

module.exports = router;
