const express = require("express");
const router = express.Router();
const sql = require("mssql");

const questions = [
  {
    question: "What is the occasion?",
    options: [
      { label: "Formal", value: 1 },
      { label: "Casual", value: 2 },
    ],
  },
  {
    question: "Which theme do you prefer?",
    options: ["Floral", "Geometric", "Traditional"],
  },
  {
    question: "Which color tone do you like?",
    options: ["Bright", "Earthy", "Neutral"],
  },
];

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recommend Me</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                display: flex;
                justify-content: center;
            }
            .container {
                max-width: 900px;
                width: 100%;
                text-align: left;
            }
            h1 {
                font-size: 2rem;
                margin-bottom: 20px;
            }
            form {
                margin-bottom: 40px;
            }
            .question {
                margin-bottom: 20px;
            }
            label {
                font-weight: bold;
                display: block;
                margin-bottom: 10px;
            }
            .options {
                margin-bottom: 20px;
            }
            input[type="radio"] {
                margin-right: 5px;
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
            .recommendations {
                margin-top: 40px;
            }
            .recommendation-title {
                font-size: 1.5rem;
                margin-bottom: 20px;
            }
            .product-container {
                display: flex;
                gap: 20px;
                margin-top: 20px;
            }
            .product-card {
                flex: 1;
                text-align: center;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 10px;
            }
            .product-image {
                width: 100%;
                height: 150px;
                background-color: #e0e0e0;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 8px;
                overflow: hidden;
                margin-bottom: 10px;
            }
            .product-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .product-name {
                font-weight: bold;
                margin-bottom: 5px;
            }
            .product-name a {
                text-decoration: none;
                color: black;
            }
            .product-name a:hover {
                text-decoration: underline;
            }
            .product-price {
                color: #555;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Recommend Me</h1>
            <form method="POST" action="/recommendMe">
                ${questions
                  .map(
                    (q, index) => `
                    <div class="question">
                        <label>${q.question}</label>
                        <div class="options">
                            ${q.options
                              .map(
                                (option) => `
                                <label>
                                    <input type="radio" name="question${index}" value="${
                                  option.value || option
                                }" required />
                                    ${option.label || option}
                                </label>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                `
                  )
                  .join("")}
                <button type="submit">Submit</button>
            </form>
            <div id="recommendations" class="recommendations"></div>
        </div>
        <script>
            document.querySelector("form").addEventListener("submit", async function (e) {
                e.preventDefault();
                const formData = new FormData(this);
                const response = await fetch("/recommendMe", {
                    method: "POST",
                    body: new URLSearchParams(formData),
                });
                const html = await response.text();
                document.getElementById("recommendations").innerHTML = html;
            });
        </script>
    </body>
    </html>
  `);
});

router.post("/", async (req, res) => {
  const { question0, question1, question2 } = req.body; // Extract answers
  let recommendations = [];

  try {
    let pool = await sql.connect(dbConfig);

    // Build SQL query for product recommendations
    let query = `
      SELECT TOP 2 productId, productName, productPrice
      FROM product
      WHERE categoryId = @categoryId
      AND (
        productDesc LIKE @theme
        OR productDesc LIKE @color
      )
    `;
    let request = pool.request();
    request.input("categoryId", sql.Int, question0);
    request.input("theme", sql.VarChar, `%${question1}%`);
    request.input("color", sql.VarChar, `%${question2}%`);

    const result = await request.query(query);
    recommendations = result.recordset;

    // Render recommendations as HTML
    const html = recommendations.length
      ? `
        <h2 class="recommendation-title">Picked for You</h2>
        <div class="product-container">
          ${recommendations
            .map(
              (product) => `
              <div class="product-card">
                  <div class="product-image">
                      <img src="/img/${product.productId}.jpg" alt="${
                product.productName
              }" />
                  </div>
                  <div class="product-name">
                      <a href="/product?id=${product.productId}">${
                product.productName
              }</a>
                  </div>
                  <div class="product-price">$${product.productPrice.toFixed(
                    2
                  )}</div>
              </div>
          `
            )
            .join("")}
        </div>
      `
      : "<p>No recommendations available for the selected options.</p>";

    res.send(html);
  } catch (err) {
    console.error("Error in POST /recommendMe:", err);
    res.status(500).send("<p>Error processing recommendations.</p>");
  }
});

module.exports = router;
