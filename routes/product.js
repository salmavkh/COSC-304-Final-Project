const express = require("express");
const router = express.Router();
const sql = require("mssql");

router.get("/", function (req, res, next) {
  res.setHeader("Content-Type", "text/html");
  (async function () {
    try {
      let pool = await sql.connect(dbConfig);

      // Get product ID from query parameter
      const productId = req.query.id;
      if (!productId) {
        res.write(`
          <html>
          <head><title>Error</title></head>
          <body><h1>Product ID is required!</h1></body>
          </html>
        `);
        res.end();
        return;
      }

      // Query to retrieve product details
      const productQuery = `SELECT * FROM product WHERE productId = @productId`;
      const productResult = await pool
        .request()
        .input("productId", sql.Int, productId)
        .query(productQuery);

      if (productResult.recordset.length === 0) {
        res.write(`
          <html>
          <head><title>Error</title></head>
          <body><h1>No product found with the given ID.</h1></body>
          </html>
        `);
        res.end();
        return;
      }

      const product = productResult.recordset[0];
      const productImageURL = `/img/${product.productId}.jpg`;

      // Query to retrieve reviews for the product
      const reviewQuery = `
        SELECT r.reviewRating, r.reviewDate, r.reviewComment, c.firstName
        FROM review r
        JOIN customer c ON r.customerId = c.customerId
        WHERE r.productId = @productId
        ORDER BY r.reviewDate DESC`;
      const reviewResult = await pool
        .request()
        .input("productId", sql.Int, productId)
        .query(reviewQuery);

      const reviews = reviewResult.recordset;

      // Display product details with reviews
      res.write(`
        <html>
        <head>
          <title>Product Details</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: white;
              color: black;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 900px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              font-size: 2rem;
              margin-bottom: 1rem;
            }
            img {
              max-width: 100%;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .price {
              font-size: 1.5rem;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .desc {
              font-size: 1rem;
              color: #555;
              margin-bottom: 20px;
            }
            .review-section {
              margin-top: 40px;
              margin-bottom: 40px;
            }
            .review {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 10px;
              margin-bottom: 10px;
            }
            .review-header {
              font-weight: bold;
              margin-bottom: 5px;
            }
            .button-container {
              margin-top: 20px;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .button {
              padding: 10px 20px;
              font-size: 1rem;
              text-decoration: none;
              border-radius: 5px;
              transition: all 0.3s ease;
            }
            .button--outline {
              border: 1px solid black;
              background-color: white;
              color: black;
            }
            .button--outline:hover {
              background-color: black;
              color: white;
            }
            .button--filled {
              background-color: black;
              color: white;
            }
            .button--filled:hover {
              background-color: #333;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <a href="/listprod" style="font-size: 2rem; margin-bottom: 20px;"><</a>
            <h1>${product.productName}</h1>
            <img src="${productImageURL}" alt="${product.productName}" />
            <p class="price">$${product.productPrice.toFixed(2)}</p>
            <p class="desc">${product.productDesc}</p>

            <div class="review-section">
              <h2>Review</h2>
              <a href="/addreview?productId=${
                product.productId
              }" >+ Add your review</a>
              ${
                reviews.length > 0
                  ? reviews
                      .map(
                        (review) => `
                        <div class="review">
                          <div class="review-header">${
                            review.firstName
                          } on ${new Date(
                          review.reviewDate
                        ).toLocaleDateString()}</div>
                          <div>[${review.reviewRating}/5] ${
                          review.reviewComment
                        }</div>
                        </div>
                      `
                      )
                      .join("")
                  : "<p>No reviews yet. Be the first to review this product!</p>"
              }
            </div>

            <div class="button-container">
              <a href="/listprod" class="button button--outline">Continue shopping</a>
              <a href="/addcart?id=${
                product.productId
              }&name=${encodeURIComponent(product.productName)}&price=${product.productPrice.toFixed(2)}" class="button button--filled">+ Add to cart</a>
            </div>
          </div>
        </body>
        </html>
      `);

      res.end();
    } catch (err) {
      console.error("Error retrieving product details:", err);
      res.write("<p>Error retrieving product details.</p>");
      res.end();
    }
  })();
});

module.exports = router;
