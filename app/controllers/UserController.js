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
};
