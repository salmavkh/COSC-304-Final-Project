const express = require("express");
const router = express.Router();
const sql = require("mssql");

router.get("/", function (req, res, next) {
  res.setHeader("Content-Type", "image/jpeg"); // Set the content type to JPEG

  // Retrieve and validate productId from query parameters
  const id = req.query.productId; // Use "productId" to align with the DDL and previous references
  const idVal = parseInt(id);
  if (isNaN(idVal)) {
    console.log("Invalid productId provided");
    res.end();
    return;
  }

  (async function () {
    try {
      const pool = await sql.connect(dbConfig);

      // TODO: Modify SQL to retrieve productImage given productId
      // SQL query to retrieve the binary product image
      const sqlQuery =
        "SELECT productImage FROM product WHERE productId = @productId";

      const result = await pool
        .request()
        .input("productId", sql.Int, idVal)
        .query(sqlQuery);

      if (result.recordset.length === 0) {
        console.log("No image record found for productId:", idVal);
        res.end();
        return;
      }

      // Retrieve the binary image
      const productImage = result.recordset[0].productImage;

      if (productImage) {
        // Write the binary image data as the response
        res.write(productImage);
      } else {
        console.log("Product image is null for productId:", idVal);
      }

      res.end();
    } catch (err) {
      console.error("Error retrieving product image:", err);
      res.write(err + "");
      res.end();
    }
  })();
});

module.exports = router;
