const express = require("express");
const router = express.Router();
const sql = require("mssql");
const auth = require("../auth");

router.get("/", async function (req, res) {
  if (!auth.checkAuthentication(req, res)) {
    return;
  }
  res.setHeader("Content-Type", "text/html");

  try {
    let pool = await sql.connect(dbConfig);
    let username = req.session.username;
    const productId = req.query.productId;

    if (!productId) {
      res.status(400).send("<p>Product ID is required.</p>");
      return;
    }

    // Get customer ID from username
    const customerQuery = `SELECT customerId FROM customer WHERE userid = @username`;
    const customerResult = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query(customerQuery);

    if (customerResult.recordset.length === 0) {
      res.status(400).send("<p>Customer not found.</p>");
      return;
    }

    const customerId = customerResult.recordset[0].customerId;

    // Check if the user has purchased the product
    const purchaseCheckQuery = `
      SELECT op.productId
      FROM orderproduct AS op
      JOIN ordersummary AS os ON op.orderId = os.orderId
      WHERE os.customerId = @customerId AND op.productId = @productId
    `;
    const purchaseCheckResult = await pool
      .request()
      .input("customerId", sql.Int, customerId)
      .input("productId", sql.Int, productId)
      .query(purchaseCheckQuery);

    if (purchaseCheckResult.recordset.length === 0) {
      // User hasn't purchased the product
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cannot Add Review</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 20px;
                }
                .message {
                    font-size: 1.2rem;
                    color: #333;
                    margin: 20px 0;
                }
                a {
                    text-decoration: none;
                    color: white;
                    background-color: black;
                    padding: 10px 20px;
                    border-radius: 5px;
                }
                a:hover {
                    background-color: #333;
                }
            </style>
        </head>
        <body>
            <h1>Cannot Add Review</h1>
            <p class="message">You can only review products you have purchased.</p>
            <a href="/product?id=${productId}">Back to Product</a>
        </body>
        </html>
      `);
      return;
    }

    // Check if the user has already reviewed the product
    const reviewCheckQuery = `
      SELECT reviewId 
      FROM review 
      WHERE customerId = @customerId AND productId = @productId
    `;
    const reviewCheckResult = await pool
      .request()
      .input("customerId", sql.Int, customerId)
      .input("productId", sql.Int, productId)
      .query(reviewCheckQuery);

    if (reviewCheckResult.recordset.length > 0) {
      // User has already reviewed the product
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Already Reviewed</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 20px;
                }
                .message {
                    font-size: 1.2rem;
                    color: #333;
                    margin: 20px 0;
                }
                a {
                    text-decoration: none;
                    color: white;
                    background-color: black;
                    padding: 10px 20px;
                    border-radius: 5px;
                }
                a:hover {
                    background-color: #333;
                }
            </style>
        </head>
        <body>
            <h1>Already Reviewed</h1>
            <p class="message">You have already submitted a review for this product.</p>
            <a href="/product?id=${productId}">Back to Product</a>
        </body>
        </html>
      `);
      return;
    }

    // Render the review form
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Add Review</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  text-align: center;
              }
              form {
                  max-width: 500px;
                  margin: 0 auto;
              }
              label {
                  display: block;
                  margin-bottom: 10px;
                  font-weight: bold;
              }
              input, textarea {
                  width: 100%;
                  padding: 10px;
                  margin-bottom: 20px;
                  border: 1px solid #ccc;
                  border-radius: 5px;
              }
              button {
                  background-color: black;
                  color: white;
                  padding: 10px 20px;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
              }
              button:hover {
                  background-color: #333;
              }
          </style>
      </head>
      <body>
          <h1>Add Review for Product</h1>
          <form method="POST" action="/addreview">
              <label for="rating">Rating (1-5):</label>
              <input type="number" id="rating" name="rating" min="1" max="5" required />
              <label for="comment">Comment:</label>
              <textarea id="comment" name="comment" rows="5" required></textarea>
              <input type="hidden" name="productId" value="${productId}" />
              <button type="submit">Submit Review</button>
          </form>
      </body>
      </html>
    `);
  } catch (err) {
    console.error("Error in GET /addreview:", err);
    res.status(500).send("Error retrieving data.");
  }
});

router.post("/", async (req, res) => {
  if (!auth.checkAuthentication(req, res)) {
    return;
  }

  const { rating, comment, productId } = req.body;

  if (!rating || !comment || !productId) {
    res.status(400).send("All fields are required.");
    return;
  }

  try {
    let pool = await sql.connect(dbConfig);
    let username = req.session.username;

    const customerQuery = `SELECT customerId FROM customer WHERE userid = @username`;
    const customerResult = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query(customerQuery);

    if (customerResult.recordset.length === 0) {
      res.send("<p>Customer not found.</p>");
      return;
    }

    const customerId = customerResult.recordset[0].customerId;

    // Insert the review
    const insertQuery = `
      INSERT INTO review (reviewRating, reviewDate, customerId, productId, reviewComment)
      VALUES (@rating, GETDATE(), @customerId, @productId, @comment)
    `;
    await pool
      .request()
      .input("rating", sql.Int, rating)
      .input("customerId", sql.Int, customerId)
      .input("productId", sql.Int, productId)
      .input("comment", sql.VarChar, comment)
      .query(insertQuery);

    res.redirect(`/product?id=${productId}`);
  } catch (err) {
    console.error("Error in POST /addreview:", err);
    res.status(500).send("Error adding review.");
  }
});

module.exports = router;
