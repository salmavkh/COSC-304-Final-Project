const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.setHeader("Content-Type", "text/html");
  res.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Checkout</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: white;
          color: black;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .container {
          max-width: 600px;
          width: 100%;
        }
        h1 {
          font-size: 1.8rem;
          margin-bottom: 20px;
        }
        .form-container {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        td {
          padding: 10px 0;
        }
        input[type="text"], input[type="password"] {
          width: 100%;
          padding: 10px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .button-container {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        input[type="submit"], input[type="reset"] {
          padding: 10px 20px;
          font-size: 1rem;
          color: black;
          background-color: white;
          border: 1px solid black;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        input[type="submit"]:hover, input[type="reset"]:hover {
          background-color: black;
          color: white;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Enter your customer ID to complete the transaction:</h1>
        <div class="form-container">
          <form method="get" action="/order">
            <table>
              <tr>
                <td>Customer ID:</td>
                <td><input type="text" name="customerId" required></td>
              </tr>
              <tr>
                <td>Password:</td>
                <td><input type="password" name="password" required></td>
              </tr>
            </table>
            <div class="button-container">
              <input type="reset" value="Reset">
              <input type="submit" value="Submit">
            </div>
          </form>
        </div>
      </div>
    </body>
    </html>
  `);

  res.end();
});

module.exports = router;
