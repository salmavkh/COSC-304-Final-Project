const express = require("express");
const router = express.Router();
const sql = require("mssql");
const moment = require("moment");

router.get("/", async function (req, res, next) {
  res.setHeader("Content-Type", "text/html");
  res.write(`
    <html>
    <head>
      <title>Urban Harvest Grocery Order List</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #fff;
          color: #000;
          margin: 0;
          padding: 20px;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 20px;
        }
        h2 {
          font-size: 1.5rem;
          margin: 15px 0;
        }
        p {
          font-size: 1rem;
          margin: 5px 0;
        }
        table {
          width: 100%;
          max-width: 900px;
          border-collapse: collapse;
          margin: 10px auto;
        }
        th, td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }
        th {
          background-color: #000;
          color: #fff;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #f1f1f1;
        }
        .total-amount {
          font-weight: bold;
          font-size: 1.2rem;
          margin: 15px 0;
        }
        hr {
          border: 0;
          height: 1px;
          background-color: #ddd;
          width: 100%;
          max-width: 900px;
          margin: 20px auto;
        }
        .error {
          color: red;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h1>Order List</h1>
  `);

  try {
    await sql.connect(dbConfig);

    // Retrieve all order headers
    const ordersResult = await sql.query`
      SELECT os.orderId, os.orderDate, os.customerId, c.firstName, c.lastName, os.totalAmount
      FROM ordersummary AS os
      JOIN customer AS c ON os.customerId = c.customerId`;

    if (ordersResult.recordset.length === 0) {
      res.write("<p>No orders found.</p>");
    } else {
      for (const order of ordersResult.recordset) {
        // Display order header information
        res.write(`
          <h2>Order ID: ${order.orderId}</h2>
          <p>Date: ${moment(order.orderDate).format(
            "MMMM Do YYYY, h:mm:ss a"
          )}</p>
          <p>Customer: ${order.firstName} ${order.lastName}</p>
        `);

        // Retrieve products in the order
        const productsResult = await sql.query`
          SELECT p.productName, op.quantity, op.price
          FROM orderproduct AS op
          JOIN product AS p ON op.productId = p.productId
          WHERE op.orderId = ${order.orderId}`;

        if (productsResult.recordset.length > 0) {
          res.write(`
            <table>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
          `);

          for (const product of productsResult.recordset) {
            res.write(`
              <tr>
                <td>${product.productName}</td>
                <td>${product.quantity}</td>
                <td>$${product.price.toFixed(2)}</td>
              </tr>
            `);
          }

          res.write("</table>");
        } else {
          res.write("<p>No products found for this order.</p>");
        }

        // Display Total Amount
        res.write(`
          <p class="total-amount">Total Amount: $${order.totalAmount.toFixed(
            2
          )}</p>
          <hr>
        `);
      }
    }
  } catch (err) {
    console.error("Database query error:", err);
    res.write(
      '<p class="error">Error retrieving orders. Please try again later.</p>'
    );
  } finally {
    sql.close();
  }

  res.write("</body></html>");
  res.end();
});

router.get("/", async function (req, res, next) {
  try {
    let pool = await sql.connect(dbConfig);

    // Fetch top 3 bestsellers
    const bestsellers = await pool.query(`
      SELECT TOP 3 
          p.productId, 
          p.productName, 
          p.productPrice, 
          SUM(op.quantity) AS totalSold
      FROM orderproduct op
      JOIN product p ON op.productId = p.productId
      GROUP BY p.productId, p.productName, p.productPrice
      ORDER BY totalSold DESC;
    `);

    // Fetch all products
    const products = await pool.query(`
      SELECT 
          p.productId, 
          p.productName, 
          p.productPrice 
      FROM product p
    `);

    // Render index.handlebars and pass the data
    res.render("index", {
      bestsellers: bestsellers.recordset,
      products: products.recordset,
    });
  } catch (err) {
    console.error("Error retrieving products:", err);
    res.status(500).send("Error retrieving products.");
  }
});

module.exports = router;
