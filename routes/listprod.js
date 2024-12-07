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

        header {
    position: sticky;
    top: 0; /* Stick to the top of the viewport */
    z-index: 1000; /* Ensure it stays on top of other elements */
    background-color: #fff; /* Optional: Background to avoid transparency */
    border-bottom: 1px solid #ddd; /* Optional: Add a border for better visibility */
    margin-bottom: 50px;
padding-bottom: 20px;
}

.container {
    display: flex;
    justify-content: space-between; /* Spaces elements evenly */
    align-items: center; /* Centers items vertically */
}

.logo {
    font-weight: bold;
    font-size: 1.2rem;
}

nav ul {
    display: flex;
    gap: 1.5rem; /* Adds space between navigation links */
    list-style: none;
    margin: 0;
    padding: 0;
}

nav ul li a {
    text-decoration: none; /* Removes underline */
    color: #333; /* Neutral dark color */
    font-size: 1rem;
}

.actions a {
    margin-left: 1rem;
    text-decoration: none;
    font-size: 1rem;
    color: #333;
}

      </style>
    </head>
    <body>
      <div class="product-list">
  `);

  res.write(`
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
