const express = require("express");
const router = express.Router();
const sql = require("mssql");

router.get("/", async function (req, res, next) {
  res.setHeader("Content-Type", "text/html");
  res.write(`
    <html>
    <head>
      <title>Product List</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin-top: 30px;
          margin-bottom: 30px;
          padding: 0;
          background-color: white;
        }

        .product-list {
          padding: 20px;
          max-width: 900px;
          margin: auto;
        }

        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          font-size: 20px;
        }

        .back-link {
          font-size: 1.2rem;
          text-decoration: none;
          color: black;
          font-weight: bold;
        }

        .filter {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .filter select,
        .filter input {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .search-btn {
          padding: 8px 12px;
          border: none;
          background-color: black;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }

        .reset-btn {
          padding: 8px 12px;
          border: 1px solid black;
          background-color: white;
          color: black;
          border-radius: 5px;
          cursor: pointer;
        }

        .reset-btn:hover {
          background-color: #f5f5f5;
        }

        .section-title {
          margin: 20px 0;
          font-size: 1.8rem;
          font-weight: bold;
          text-align: left;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr); /* 3 items per row */
          gap: 20px;
        }

        .product-card {
          background: white;
          text-align: center;
          margin-bottom: 10px;
        }

        .product-image {
          width: 100%;
          height: 300px; /* Make images square */
          object-fit: cover; /* Ensure images fit within the square */
          margin-bottom: 15px;
          border-radius: 15px;
        }

        .product-name a {
          text-decoration: none;
          color: #000;
          font-size: 1rem;
          font-weight: normal;
          font-size: 20px;
        }

        .product-name a:hover {
          text-decoration: underline;
        }

        .product-price {
          font-size: 1.2rem;
          margin: 5px 0;
        }

        .add-to-cart-btn {
          display: inline-block;
          padding: 8px 12px;
          background-color: black;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 10px;
        }

        .add-to-cart-btn:hover {
          background-color: #333;
        }
      </style>
    </head>
    <body>
      <div class="product-list">
  `);

  res.write(`
    <div class="product-header">
      <a href="/" class="back-link" style="font-size: 25px; margin-top: -15px; font-weight: normal;"><  Product</a>
      <form method="GET" action="/listprod/" class="filter">
        <label for="categoryFilter">Filter by</label>
        <select id="categoryFilter" name="categoryId">
          <option value="">All Categories</option>
  `);

  // Fetch categories from the database
  let categories = [];
  try {
    let pool = await sql.connect(dbConfig);
    const categoryResults = await pool
      .request()
      .query("SELECT categoryId, categoryName FROM category");
    categories = categoryResults.recordset;
  } catch (err) {
    console.error("Error retrieving categories:", err);
  }

  categories.forEach((category) => {
    const selected =
      req.query.categoryId == category.categoryId ? "selected" : "";
    res.write(
      `<option value="${category.categoryId}" ${selected}>${category.categoryName}</option>`
    );
  });

  const name = req.query.productName || "";

  res.write(`  
        </select>
        <input type="text" name="productName" placeholder="Search Product Name" value="${name}" />
        <button type="submit" class="search-btn">Search</button>
        <button type="button" class="reset-btn" onclick="resetForm()">Reset</button>
      </form>
    </div>
  `);

  // Fetch all products
  let sqlQuery = `SELECT p.productId, p.productName, p.productPrice FROM product p LEFT JOIN category c ON p.categoryId = c.categoryId`;
  let queryParameters = [];
  let whereConditions = [];

  if (name) {
    whereConditions.push("p.productName LIKE @productName");
    queryParameters.push({
      name: "productName",
      type: sql.VarChar,
      value: `%${name}%`,
    });
  }

  if (req.query.categoryId) {
    whereConditions.push("p.categoryId = @categoryId");
    queryParameters.push({
      name: "categoryId",
      type: sql.Int,
      value: req.query.categoryId,
    });
  }

  if (whereConditions.length > 0) {
    sqlQuery += " WHERE " + whereConditions.join(" AND ");
  }

  try {
    let pool = await sql.connect(dbConfig);
    let request = pool.request();
    queryParameters.forEach((param) =>
      request.input(param.name, param.type, param.value)
    );
    let results = await request.query(sqlQuery);

    res.write(
      '<div><h2 class="section-title">All Products</h2><div class="product-grid">'
    );
    // All Products Section
    results.recordset.forEach((product) => {
      const imageURL = `/img/${product.productId}.jpg`; // Image filename directly uses productId
      res.write(`
    <div class="product-card">
      <img src="${imageURL}" alt="${
        product.productName
      }" class="product-image" />
      <h3 class="product-name"><a href="/product?id=${product.productId}">${
        product.productName
      }</a></h3>
      <p class="product-price">$${product.productPrice.toFixed(2)}</p>
    </div>
  `);
    });
    res.write("</div></div>");
  } catch (err) {
    console.error("Error retrieving products:", err);
    res.write("<p>Error retrieving products.</p>");
  }

  res.write(`  
      </div>
      <script>
        function resetForm() {
          document.querySelector('input[name="productName"]').value = '';
          document.querySelector('select[name="categoryId"]').value = '';
        }
      </script>
    </body>
    </html>
  `);
  res.end();
});

module.exports = router;
