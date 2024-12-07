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
    max-width: 900px; /* Restrict content width */
    margin: 50px auto; /* Center container and add vertical spacing */
    padding: 20px;
    text-align: left;
}

/* Header styles */
header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    margin-bottom:-30px;
    margin-top:-50px;
    height: 70px;

}

header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header .logo {
    font-weight: bold;
    font-size: 1.2rem;
}

header nav ul {
    display: flex;
    gap: 1rem; /* Adjust spacing between navigation links */
    list-style: none;
    margin: 0;
    padding: 0;
}

header nav ul li a {
    text-decoration: none;
    color: #333;
    font-size: 1rem;
}

/* Shopping cart page styles */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-title {
    font-size: 1.8rem;
    font-weight: bold;
}

.back-link {
    font-size: 1rem;
    text-decoration: none;
    color: black;
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
    padding: 10px; /* Adjust padding for tighter spacing */
    text-align: left;
}

.cart-table td:last-child {
    text-align: right;
}

.cart-table .total {
    font-weight: bold;
}

/* Button container */
.button-container {
    display: flex;
    justify-content: flex-end;
    gap: 15px; /* Consistent gap between buttons */
    margin-top: 20px; /* Add spacing above buttons */
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

/* Actions for navigation links */
.actions a {
    margin-left: 1rem;
    text-decoration: none;
    font-size: 1rem;
    color: #333;
}

/* Empty cart message */
.empty-cart {
    text-align: center; /* Center-align the message */
    margin: 40px 0; /* Add spacing around the message */
}

.empty-cart h1 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 20px;
}

.empty-cart .button {
    margin-top: 20px; /* Add spacing above the button */
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
        <div class="header">
          <a href="/" class="back-link">< Your Shopping Cart</a>
        </div>
  `);

  if (req.session.productList) {
    productList = req.session.productList;
    if (req.query.update) {
      const updateId = req.query.update;
      const newqty = req.query.newqty;
      productList[updateId].quantity = newqty;
    } else if (req.query.delete) {
      // Find the index of the product to delete
      const deleteId = req.query.delete;

      // Remove the product if found
      productList.splice(deleteId, 1);
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
          <td align="center">Quantity:<input type="text" name="newqty${qtyid}" size="5" value=${
        product.quantity
      }></td>
          <td><a href="showcart?delete=${
            product.id
          }">Remove Item from Cart</a></td>
          <td><input type="button" onclick="update(${
            product.id
          }, document.form1.newqty${qtyid}.value)" value="Update Quantity"></td>
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
