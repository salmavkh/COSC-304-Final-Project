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
/* General styles */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  
}

.container {
    max-width: 900px; /* Restrict content width to 900px */
    margin: 0 auto; /* Center the container horizontally */
    padding: 20px; /* Add padding for spacing */
    text-align: left; /* Align content to the left */
}

/* Header styles */
header {
    position: sticky;
    top: 0; /* Stick to the top of the viewport */
    z-index: 1000; /* Ensure it stays on top of other elements */
    background-color: #fff; /* White background for clarity */
    border-bottom: 1px solid #ddd; /* Subtle border for separation */
    padding: 10px 20px; /* Add padding for spacing */
    width: 100%; /* Ensure header spans the full width of the viewport */
}

header .container {
    display: flex; /* Flexbox for layout */
    justify-content: space-between; /* Space out logo and navigation */
    align-items: center; /* Vertically center items */
}

header .logo {
    font-weight: bold;
    font-size: 1.5rem; /* Larger font for emphasis */
    text-decoration: none; /* Remove underline */
    color: #000; /* Black for visibility */
}

nav ul {
    display: flex;
    gap: 1.5rem; /* Add space between navigation links */
    list-style: none; /* Remove bullet points */
    margin: 0;
    padding: 0;
}

nav ul li a {
    text-decoration: none; /* Remove underline */
    color: #333; /* Neutral dark color */
    font-size: 1rem;
    transition: color 0.3s ease; /* Smooth hover effect */
}

nav ul li a:hover {
    color: #007BFF; /* Change color on hover */
}

.actions a {
    margin-left: 1rem; /* Add spacing between actions */
    text-decoration: none;
    font-size: 1rem;
    color: #333;
    transition: color 0.3s ease;
}

.actions a:hover {
    color: #007BFF; /* Change color on hover */
}

/* Main content styles */
main {
    max-width: 900px; /* Limit main content width */
    margin: 20px auto; /* Center main content horizontally */
    padding: 0 20px; /* Add padding for spacing */
    text-align: left; /* Align text to the left */
}

h1 {
    font-size: 2rem;
    margin-bottom: 20px;
    text-align: left; /* Align the title to the left */
}

/* Form styles */
form {
    margin-bottom: 40px;
    width: 100%; /* Full width within the container */
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
    background-color: #333; /* Darker color on hover */
}

/* Recommendations styles */
.recommendations {
    margin-top: 40px;
}

.recommendation-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
    text-align: left; /* Align recommendation title to the left */
}

.product-container {
    display: flex;
    gap: 20px; /* Add spacing between products */
    margin-top: 20px;
}

.product-card {
    flex: 1;
    text-align: center;
    border: 1px solid #ddd; /* Subtle border */
    border-radius: 8px; /* Rounded corners */
    padding: 10px;
    background-color: #fff; /* White background for cards */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

.product-image {
    width: 100%;
    height: 150px;
    background-color: #e0e0e0; /* Placeholder background color */
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
    color: #555; /* Subtle text color for pricing */
}

        </style>
    </head>
    <body>
    <header>
        <div class="container">
            <div class="logo"><a href="/" style="color: black; text-decoration:none;">Batik Fusion</a></div>
            <nav>
                <ul>
                    <li><a href="/listprod">Products</a></li>
                    <li><a href="/recommendMe">Recommend Me</a></li>
                    <li><a href="/aboutUs">About Us</a></li>
                </ul>
            </nav>
            <div class="actions">
                <a href="/showcart" class="cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 19.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5zm3.5-1.5c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm6.305-15l-3.432 12h-10.428l-2.937-7h11.162l-1.412 5h2.078l1.977-7h-16.813l4.615 11h13.239l3.474-12h1.929l.743-2h-4.195z"/></svg>
                </a>
                <a href="/customer" class="cart"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm8.127 19.41c-.282-.401-.772-.654-1.624-.85-3.848-.906-4.097-1.501-4.352-2.059-.259-.565-.19-1.23.205-1.977 1.726-3.257 2.09-6.024 1.027-7.79-.674-1.119-1.875-1.734-3.383-1.734-1.521 0-2.732.626-3.409 1.763-1.066 1.789-.693 4.544 1.049 7.757.402.742.476 1.406.22 1.974-.265.586-.611 1.19-4.365 2.066-.852.196-1.342.449-1.623.848 2.012 2.207 4.91 3.592 8.128 3.592s6.115-1.385 8.127-3.59zm.65-.782c1.395-1.844 2.223-4.14 2.223-6.628 0-6.071-4.929-11-11-11s-11 4.929-11 11c0 2.487.827 4.783 2.222 6.626.409-.452 1.049-.81 2.049-1.041 2.025-.462 3.376-.836 3.678-1.502.122-.272.061-.628-.188-1.087-1.917-3.535-2.282-6.641-1.03-8.745.853-1.431 2.408-2.251 4.269-2.251 1.845 0 3.391.808 4.24 2.218 1.251 2.079.896 5.195-1 8.774-.245.463-.304.821-.179 1.094.305.668 1.644 1.038 3.667 1.499 1 .23 1.64.59 2.049 1.043z"/></svg></a>
                    


            </div>
        </div>
    </header>
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
