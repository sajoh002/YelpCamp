const express = require("express");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ email, username });
      const registereduser = await User.register(user, password);
      req.flash("success", "Welcome to YelpCamp!");
      res.redirect("/campgrounds");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

module.exports = router;
