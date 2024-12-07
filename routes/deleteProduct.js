const express = require("express");
const router = express.Router();
const auth = require("../auth");
const sql = require("mssql");

router.post("/", async function (req, res) {
    const productId=parseInt(req.body.productId);
    
  

    try
    {const pool= await sql.connect(dbConfig);
      const selectquery = `
      SELECT * FROM product WHERE productId='${productId}';
          `;
      const result = await pool
      .request()
      .input("productId", sql.Int, productId)
      .query(selectquery);
      
      if(result.recordset.length==1){
    const addproductquery=await sql.query`DELETE FROM product WHERE productId=${productId}`;
    res.redirect("/admin?success=2"); // Redirect to the login page
    }
    else{
      res.redirect("/admin?error=1");
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