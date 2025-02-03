module.exports = {
  // https://localhost/user
  get: (req, res) => {
    res.sendfile("/public/view/user.html", { root: "." });
  },
  // https://localhost/user/login
  login: (req, res) => {
    res.sendfile("/public/view/login.html", { root: "." });
  },
  // https://localhost/user/register
  register: (req, res) => {
    res.sendfile("/public/view/register.html", { root: "." });
  },
  // https://localhost/user/admin
  admin: (req, res) => {
    res.sendfile("/public/view/admin.html", { root: "." });
  },
  post: (req, res) => {
    // Affiche le user et mdp dans le terminal
    const username = req.body.username;
    const password = req.body.password;

    console.log(username + " " + password);
    // Va à la page User
    res.sendfile("/public/view/user.html", { root: "." });
  },
};
