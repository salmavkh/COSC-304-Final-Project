const express = require("express");
const router = express.Router();
const auth = require("../auth");
const sql = require("mssql");

router.post("/", async function (req, res) {
    const productName=req.body.productName;
    const productPrice=req.body.productPrice;
    const productDesc=req.body.productDesc;
    const categoryId=req.body.categoryId;
    const categoryIdparseInt=parseInt(categoryId);
    const productPriceDouble=parseFloat(productPrice).toFixed(2);
  

    try
    {await sql.connect(dbConfig);
    const addproductquery=await sql.query`INSERT INTO product (productName,
    productPrice,
    productDesc,
    categoryId) VALUES(${productName}, ${productPriceDouble}, ${productDesc}, ${categoryIdparseInt})`;
    res.redirect("/admin?success=1"); // Redirect to the login page
}catch (err) {
        console.error("Database query error:", err);
        res.write("<p>Error retrieving orders.</p>");
        return;
      } finally {
        sql.close();
      }

});

module.exports = router;