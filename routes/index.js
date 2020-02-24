const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", (req, res) => res.render("Welcome"));

// Dashboard Page
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    username: req.user.username
  })
);

module.exports = router;
