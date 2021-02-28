
let express = require("express");
let router = express.Router();
let passport = require("passport");
let { checkAuthentication } = require("../config/authentication");

//login GET request
router.get("/", (req, res, next) => {
    res.render('login', {title: 'Login Page'})
})

// Login post handle
router.post("/", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/contact-list",
    failureRedirect: "/login",
    // failureFlash: true,
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;