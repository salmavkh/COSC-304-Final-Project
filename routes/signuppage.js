const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  const successMessage=req.query.success ? "Registered successfully. Please log in.":null;
  res.setHeader("Content-Type", "text/html");

  // Retrieve and reset login message
  let loginMessage = req.session.loginMessage || false;
  req.session.loginMessage = false; // Clear the message after retrieving it
if(!req.query.error)
  {res.send(`
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
                .signup-container {
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
input[type="text"], input[type="password"], input[type="tel"], input[type="email"] {
                    padding: 10px;
                    font-size: 1rem;
                    border: 1px solid #ccc;
                    border-radius: 5px;
               
                }
                .signup-button {
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
                        <div class="signup-container">
                <h1>Signup</h1>
                <form method="POST" action="/signup">
                    <input type="text" name="firstName" placeholder="First Name" required>
                    <input type="text" name="lastName" placeholder="Last Name" required>    
                    <input type="email" name="email" placeholder="Email" required>  
                    <input type="tel" name="phonenum" placeholder="Phone" required>  
                    <input type="text" name="address" placeholder="Address" required>         
                    <input type="text" name="city" placeholder="City" required>
                    <input type="text" name="state" placeholder="State" required>
                    <input type="text" name="postalCode" placeholder="Postal Code" required>         
                    <input type="text" name="country" placeholder="Country" required>   
                    <input type="text" name="userid" placeholder="Username" required>  
                    <input type="password" name="password" placeholder="Password" required>
                    <button type="submit" class="signup-button">Sign Up</button>
                </form>
            </div>
        </body>
        </html>
    `);}else{
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
                    .signup-container {
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
    input[type="text"], input[type="password"], input[type="tel"], input[type="email"] {
                        padding: 10px;
                        font-size: 1rem;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                   
                    }
                    .signup-button {
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
                            <div class="signup-container">
                    <h1>Signup</h1>
                    <h2>Account with the username you entered already exist! try again with another username!</h2>
                    <form method="POST" action="/signup">
                        <input type="text" name="firstName" placeholder="First Name" required>
                        <input type="text" name="lastName" placeholder="Last Name" required>    
                        <input type="email" name="email" placeholder="Email" required>  
                        <input type="tel" name="phonenum" placeholder="Phone" required>  
                        <input type="text" name="address" placeholder="Address" required>         
                        <input type="text" name="city" placeholder="City" required>
                        <input type="text" name="state" placeholder="State" required>
                        <input type="text" name="postalCode" placeholder="Postal Code" required>         
                        <input type="text" name="country" placeholder="Country" required>   
                        <input type="text" name="userid" placeholder="Username" required>  
                        <input type="password" name="password" placeholder="Password" required>
                        <button type="submit" class="signup-button">Sign Up</button>
                    </form>
                </div>
            </body>
            </html>
        `);
    }
});

module.exports = router;
