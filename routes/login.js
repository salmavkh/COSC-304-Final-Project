const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.setHeader("Content-Type", "text/html");

  // Retrieve and reset login message
  let loginMessage = req.session.loginMessage || false;
  req.session.loginMessage = false; // Clear the message after retrieving it

  res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Screen</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    color: #333;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .login-container {
                    background-color: #ffffff;
                    border-radius: 10px;
                    padding: 40px;
                    text-align: center;
                    width: 100%;
                    max-width: 400px;
                }
                h1 {
                    color: black;
                    margin-bottom: 20px;
                }
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                input[type="text"], input[type="password"] {
                    padding: 10px;
                    font-size: 1rem;
                    border: 1px solid #ccc;
                    border-radius: 5px;
               
                }
                .login-button {
                    padding: 10px;
               
                    font-size: 1rem;
                    background-color: black;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                .message {
                    color: red;
                    font-size: 0.9rem;
                    margin-bottom: 15px;
                }
            </style>
        </head>
        <body>
            <div class="login-container">
                <h1>Login</h1>
                ${loginMessage ? `<p class="message">${loginMessage}</p>` : ""}
                <form method="POST" action="/validateLogin">
                    <input type="text" name="username" placeholder="Username" required>
                    <input type="password" name="password" placeholder="Password" required>
                    <button type="submit" class="login-button">Login</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

module.exports = router;
