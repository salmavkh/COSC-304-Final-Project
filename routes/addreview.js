const express = require("express");
const router = express.Router();
const sql = require("mssql");
const auth = require("../auth");

router.get("/", function (req, res, next) {
  if (!auth.checkAuthentication(req, res)) {
    return;
  }
  res.setHeader("Content-Type", "text/html");

  (async function () {
    try {
      let pool = await sql.connect(dbConfig);
      let username = req.session.username;
      const productId = req.query.productId;

      if (!productId) {
        res.send("<p>Product ID is required.</p>");
        return;
      }

      // Fetch customer and product information
      const customerQuery = `SELECT customerId FROM customer WHERE userid = @username`;
      const productQuery = `SELECT productName FROM product WHERE productId = @productId`;

      const [customerResult, productResult] = await Promise.all([
        pool
          .request()
          .input("username", sql.VarChar, username)
          .query(customerQuery),
        pool
          .request()
          .input("productId", sql.Int, productId)
          .query(productQuery),
      ]);

      if (
        customerResult.recordset.length === 0 ||
        productResult.recordset.length === 0
      ) {
        res.send("<p>Customer or product not found.</p>");
        return;
      }

      const customer = customerResult.recordset[0];
      const product = productResult.recordset[0];

      // Check if the customer has already reviewed the product
      const reviewCheckQuery = `
        SELECT reviewId 
        FROM review 
        WHERE customerId = @customerId AND productId = @productId
      `;
      const reviewCheckResult = await pool
        .request()
        .input("customerId", sql.Int, customer.customerId)
        .input("productId", sql.Int, productId)
        .query(reviewCheckQuery);

      if (reviewCheckResult.recordset.length > 0) {
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
                      padding: 20px;
                      text-align: center;
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

      // Render add review form
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
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                }
                .container {
                    max-width: 600px;
                    width: 100%;
                }
                h1 {
                    font-size: 2rem;
                    margin-bottom: 20px;
                }
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                label {
                    font-weight: bold;
                }
                input, textarea {
                    width: 100%;
                    padding: 10px;
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
            <div class="container">
                <h1>Add Review for ${product.productName}</h1>
                <form method="POST" action="/addreview">
                    <label for="rating">Rating (1-5):</label>
                    <input type="number" id="rating" name="rating" min="1" max="5" required />

                    <label for="comment">Comment:</label>
                    <textarea id="comment" name="comment" rows="5" required></textarea>

                    <input type="hidden" name="productId" value="${productId}" />
                    <button type="submit">Submit Review</button>
                </form>
            </div>
        </body>
        </html>
      `);
    } catch (err) {
      console.error("Error retrieving customer or product information:", err);
      res.send("<p>Error retrieving data.</p>");
    }
  })();
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

    // Insert review into database
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
    console.error("Error adding review:", err);
    res.status(500).send("<p>Error adding review.</p>");
  }
});

module.exports = router;
