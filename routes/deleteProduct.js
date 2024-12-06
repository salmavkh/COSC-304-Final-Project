const express = require("express");
const router = express.Router();
const auth = require("../auth");
const sql = require("mssql");

router.post("/", async function (req, res) {
    const productId=parseInt(req.body.productId);
  

    try
    {await sql.connect(dbConfig);
    const addproductquery=await sql.query`DELETE FROM product WHERE productId=${productId}`;
    res.redirect("/admin?success=2"); // Redirect to the login page
}catch (err) {
        console.error("Database query error:", err);
        res.write("<p>Error retrieving orders.</p>");
        return;
      } finally {
        sql.close();
      }

});

module.exports = router;