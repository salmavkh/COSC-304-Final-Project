const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.send("Error logging out.");
    } else {
      // Redirect to home page after logout
      res.redirect("/");
    }
  });
});

module.exports = router;
