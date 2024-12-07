const express = require("express");
const router = express.Router();
const auth = require("../auth");
const sql = require("mssql");

router.post("/", async function (req, res) {
    const productId=parseInt(req.body.productId);
    const productName=req.body.productName
    const productDesc=req.body.productDesc;
    const productPrice=parseFloat(req.body.productPrice).toFixed(2);

  

    try
    {
      const pool= await sql.connect(dbConfig);
      const selectquery = `
      SELECT * FROM product WHERE productId='${productId}';
          `;
      const result = await pool
      .request()
      .input("productId", sql.Int, productId)
      .query(selectquery);
      
      if(result.recordset.length==1){
      await sql.connect(dbConfig);
    const addproductquery=await sql.query`UPDATE product 
    SET productName=${productName}, productDesc=${productDesc}, productPrice=${productPrice}
    WHERE productId=${productId}`;
    res.redirect("/admin?success=3"); // Redirect to the login page
    }else{
      res.redirect("/admin?error=2");
    }
}catch (err) {
        console.error("Database query error:", err);
        res.write("<p>Error retrieving orders.</p>");
        return;
      } finally {
        sql.close();
      }

});

module.exports = router;