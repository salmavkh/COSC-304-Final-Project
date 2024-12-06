const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  let productList = false;
  res.setHeader("Content-Type", "text/html");
  res.write(`
        <script>function update(newid, newqty)
{
	window.location="showcart?update="+newid+"&newqty="+newqty;
}</script>
    <html>
    <head>
      <title>Your Shopping Cart</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: white;
          color: black;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 900px;
          margin: 50px auto;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .header-title {
          font-size: 1.8rem;
          text-align: left;
        }
        .back-link {
          font-size: 1rem;
          text-decoration: none;
          color: black;
          display: inline-block;
          margin-bottom: 20px;
        }
        .cart-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .cart-table tr {
          border-bottom: 1px solid #ddd;
        }
        .cart-table td {
          padding: 15px 10px;
          text-align: left;
        }
        .cart-table td:last-child {
          text-align: right;
        }
        .cart-table .total {
          font-weight: bold;
        }
        .button-container {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          font-size: 1rem;
          text-decoration: none;
          border-radius: 5px;
          cursor: pointer;
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
        <div class="header">
          <a href="/" class="back-link">< Your Shopping Cart</a>
        </div>
  `);

  if (req.session.productList) {
    productList = req.session.productList;
    if(req.query.update){
      const updateId=req.query.update;
      const newqty=req.query.newqty;
      productList[updateId].quantity=newqty;
    }
    else if(req.query.delete){
      // Find the index of the product to delete
      const deleteId = req.query.delete;
      
      // Remove the product if found
        productList.splice(deleteId,1);
        req.session.productList = productList;
      // Update the session with the modified productList
    }
    res.write(`
      <form name="form1">
      <table class="cart-table">
    `);

    let total = 0;
    let qtyid = 0;
    for (let i = 0; i < productList.length; i++) {
      const product = productList[i];
      if (!product) {
        continue;
      }

      res.write(`
        <tr>
          <td>${product.name} (ID: ${product.id})</td>
          <td align="center">Quantity:<input type="text" name="newqty${qtyid}" size="5" value=${product.quantity}></td>
          <td><a href="showcart?delete=${product.id}">Remove Item from Cart</a></td>
          <td><input type="button" onclick="update(${product.id}, document.form1.newqty${qtyid}.value)" value="Update Quantity"></td>
          <td>$${(Number(product.quantity) * Number(product.price)).toFixed(
            2
          )}</td>
        </tr>
      `);
      total += product.quantity * product.price;
    }
    res.write(`
      <tr class="total">
        <td colspan="2" class="total">Total</td>
        <td>$${total.toFixed(2)}</td>
      </tr>
    </table>
    <div class="button-container">
      <a href="/listprod" class="button button--outline">Continue shopping</a>
      <a href="/checkout" class="button button--filled">Check out</a>
    </div>
    `);
  } else {
    res.write("<h1>Your shopping cart is empty!</h1>");
    res.write(`
      <div class="button-container">
        <a href="/listprod" class="button button--outline">Continue shopping</a>
      </div>
    `);
  }

  res.write(`
      </div>
    </body>
    </html>
  `);
  res.end();
});

module.exports = router;
