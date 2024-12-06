const express = require("express");
const router = express.Router();
const auth = require("../auth");
const sql = require("mssql");

router.post("/", function (req, res) {
  // Preserve async context since we make an async call to the database in validateLogin function.
  (async () => {
    let authenticatedUser = await validateLogin(req);
    if (authenticatedUser) {
      req.session.loginMessage = false; // Clear any previous messages
      req.session.username = authenticatedUser; // Store the username in the session
      res.redirect("/"); // Redirect to the main page on successful login
    } else {
      req.session.loginMessage = "Login failed. Wrong username or password.";
      res.redirect("/login?error=1"); // Redirect back to login with an error query parameter
    }
  })();
});

async function validateLogin(req) {
  if (!req.body || !req.body.username || !req.body.password) {
    return false;
  }

  let username = req.body.username;
  let password = req.body.password;
  let authenticatedUser = await (async function () {
    try {
      let pool = await sql.connect(dbConfig);
      const result = await pool
        .request()
        .input("username", sql.VarChar, username)
        .input("password", sql.VarChar, password).query(`
          SELECT customerId 
          FROM customer 
          WHERE userId = @username AND password = @password
        `);

      if (result.recordset.length > 0) {
        return username; // User authenticated
      }
      return false;
    } catch (err) {
      console.error("Database error:", err);
      return false;
    }
  })();

  return authenticatedUser;
}

module.exports = router;
