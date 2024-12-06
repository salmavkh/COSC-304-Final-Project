const express = require("express");
const router = express.Router();
const sql = require("mssql");

router.get("/", async function (req, res, next) {
  res.setHeader("Content-Type", "text/html");
  res.write(`
    <html>
    <head>
      <title>YOUR NAME Grocery Order Processing</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: white;
          color: #333;
          margin: 0;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        h1 {
          color: black;
          font-weight: bold;
          margin-bottom: 20px;
        }
        h2 {
          margin-top: 20px;
          color: black;
        }
        table {
          width: 80%;
          max-width: 600px;
          border-collapse: collapse;
          margin: 20px auto;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }
        th, td {
          padding: 12px;
          border: 1px solid #ccc;
          text-align: center;
        }
        th {
          background-color: black;
          color: #fff;
        }
        tr:nth-child(even) {
          background-color: white;
        }
        .order-total {
          font-weight: bold;
          font-size: 1.1rem;
          color: #333;
        }
        .message {
          font-size: 1.1rem;
          color: black;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
  `);

  const customerId = req.query.customerId;
  const productList = req.session ? req.session.productList : null;
  const password = req.query.password;

  if (!customerId) {
    res.write(
      "<h1>Invalid customer id. Go back to the previous page and try again.</h1>"
    );
    res.write("</body></html>");
    res.end();
    return;
  }
  if (!password) {
    res.write(
      "<h1>Invalid password (password cannot be empty!). Go back to the previous page and try again.</h1>"
    );
    res.write("</body></html>");
    res.end();
    return;
  }

  if (!productList || productList.length === 0) {
    res.write("<h1>Your shopping cart is empty!</h1>");
    res.write("</body></html>");
    res.end();
    return;
  }

  try {
    const pool = await sql.connect(dbConfig);

    const customerResult = await pool
      .request()
      .input("customerId", sql.Int, customerId)
      .input("password", sql.VarChar, password)
      .query(
        "SELECT * FROM customer WHERE customerId = @customerId AND password = @password"
      );

    if (customerResult.recordset.length === 0) {
      res.write(
        "<h1>Error in customer credentials. Please return to the previous page and try again!</h1>"
      );
      res.write("</body></html>");
      res.end();
      return;
    }

    const orderResult = await pool
      .request()
      .input("customerId", sql.Int, customerId)
      .query(
        "INSERT INTO ordersummary (customerId, orderDate, totalAmount) OUTPUT INSERTED.orderId VALUES (@customerId, GETDATE(), 0)"
      );

    const orderId = orderResult.recordset[0].orderId;
    let totalAmount = 0;

    for (const product of productList) {
      if (!product) continue;

      const subtotal = product.quantity * product.price;
      totalAmount += subtotal;

      await pool
        .request()
        .input("orderId", sql.Int, orderId)
        .input("productId", sql.Int, product.id)
        .input("quantity", sql.Int, product.quantity)
        .input("price", sql.Decimal(10, 2), product.price)
        .query(
          "INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, @productId, @quantity, @price)"
        );
    }

    await pool
      .request()
      .input("orderId", sql.Int, orderId)
      .input("totalAmount", sql.Decimal(10, 2), Number(totalAmount).toFixed(2))
      .query(
        "UPDATE ordersummary SET totalAmount = @totalAmount WHERE orderId = @orderId"
      );

    res.write("<h1>Your Order Summary</h1>");
    res.write(
      "<table><tr><th>Product Id</th><th>Product Name</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr>"
    );

    for (const product of productList) {
      if (!product) continue;
      const subtotal = Number(product.quantity * product.price).toFixed(2);
      res.write(`
        <tr>
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>${product.quantity}</td>
          <td>$${Number(product.price).toFixed(2)}</td>
          <td>$${subtotal}</td>
        </tr>
      `);
    }

    res.write(`
      <tr><td colspan="4" class="order-total" style="text-align:right;">Total</td><td class="order-total">$${Number(
        totalAmount
      ).toFixed(2)}</td></tr>
    </table>`);

    res.write(`
      <h2 class="message">Order Completed. Will be shipped soon...</h2>
      <h2 class="message">Your order reference number is: ${orderId}</h2>
      <h2 class="message">Shipping to customer: ${customerId} Name: ${customerResult.recordset[0].firstName} ${customerResult.recordset[0].lastName}</h2>
    `);

    req.session.productList = null;
  } catch (err) {
    console.error(err);
    res.write("<h1>Error processing your order.</h1>");
  }

  res.write("</body></html>");
  res.end();
});

module.exports = router;
