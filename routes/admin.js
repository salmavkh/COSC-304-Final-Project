const express = require("express");
const router = express.Router();
const auth = require("../auth"); // Include auth middleware
const sql = require("mssql");

router.get("/", function (req, res, next) {
  // Include authentication check
  if (!req.session || !req.session.username) {
    res.redirect("/login"); // Redirect to login if the user is not authenticated
    return;
  }

  res.setHeader("Content-Type", "text/html");

  (async function () {
    try {
      let pool = await sql.connect(dbConfig);

      // SQL query to calculate total order amounts grouped by day
      const query = `
                SELECT 
                    CAST(orderDate AS DATE) AS orderDate, 
                    SUM(totalAmount) AS totalOrderAmount
                FROM ordersummary
                GROUP BY CAST(orderDate AS DATE)
                ORDER BY orderDate
            `;

      const result = await pool.request().query(query);
      const customerQuery = `SELECT firstName, lastName from customer ORDER BY firstName asc`;
      const custresult = await pool.request().query(customerQuery);
      // Display the report
      res.write(`
                <html>
                <head>
                    <title>Administrator Sales Report</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            background-color: #f9f9f9;
                        }
                        h1 {
                            color: black;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            padding: 10px;
                            text-align: left;
                            border: 1px solid #ccc;
                        }
                        th {
                            background-color: black;
                            color: white;
                        }
                        tr:nth-child(even) {
                            background-color: #f2f2f2;
                        }
                        a {
                            text-decoration: none;
                            color: black;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <h1>Administrator Sales Report by Day</h1>
                    <table>
                        <tr>
                            <th>Order Date</th>
                            <th>Total Order Amount</th>
                        </tr>
            `);

      // Loop through query results and generate table rows

      result.recordset.forEach((row) => {
        res.write(`
                    <tr>
                        <td>${row.orderDate}</td>
                        <td>$${row.totalOrderAmount.toFixed(2)}</td>
                    </tr>
                `);
      });

      res.write(`
                    </table>
                    <br>
                    <a href="/">Back to Main Page</a>
<br>
<h2>Customer Name's List</h2>
<table>
<th> Name </th>
`);
      custresult.recordset.forEach((row) => {
        res.write(`<tr>
    <td>${row.firstName} ${row.lastName}</td>
    </tr>`);
      });

      res.write(`

                </table>
                `);
      res.write(`<h2>Add product</h3>
           <form method="POST" action="/addproduct">
           <table>
           <tr><td>Product Name</td><td><input type="text" name="productName" size="20" required></td></tr>
           <tr><td>Category ID </td><td><input type="number" name="categoryId" size="20" required></td></tr>
           <tr><td>Product Desc</td><td><input type="text" name="productDesc" size="20" required></td></tr>
           <tr><td>Product Price</td><td><input type="text" name="productPrice" size="20" required></td></tr>
           </table>
           <button type="submit">Add Product</button>
           </form>

    `);
      if (parseInt(req.query.success) === 1) {
        res.write(`<p>Item successfully added!</p>`);
      }

      //////// Delete Product
      res.write(`<h2>Delete product</h3>
    <form method="POST" action="/deleteproduct">
    <table>
    <tr><td>Product ID:</td><td><input type="text" name="productId" size="20" required></td></tr>
    </table>
    <button type="submit">Delete Product</button>
    </form>

`);
      if (parseInt(req.query.success) === 2) {
        res.write(`<p>Item successfully deleted!</p>`);
      }

      ////////

      /////// Update Product
      res.write(`<h2>Update Product</h3>
    <form method="POST" action="/updateproduct">
    <table>
    <tr><td>Product ID </td><td><input type="number" name="productId" size="20" required></td></tr>
    <tr><td>Product Name</td><td><input type="text" name="productName" size="20" required></td></tr>
    <tr><td>Product Desc</td><td><input type="text" name="productDesc" size="20" required></td></tr>
    <tr><td>Product Price</td><td><input type="text" name="productPrice" size="20" required></td></tr>
    </table>
    <button type="submit">Update Product </button>
    </form>

`);
      if (parseInt(req.query.success) === 3) {
        res.write(`<p>Item successfully updated!</p>`);
      }
      ///////

      res.write(`
                </body>
                </html>
            `);

      res.end();
    } catch (err) {
      console.error("Error retrieving sales report:", err);
      res.write("<p>Error retrieving sales report.</p>");
      res.end();
    }
  })();
});

module.exports = router;
