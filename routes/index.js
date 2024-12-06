const express = require("express");
const router = express.Router();
const sql = require("mssql");

// Rendering the main page with bestsellers
router.get("/", async function (req, res) {
  const username = req.session.username || false; // Fetch username from session
  let bestsellers = [];

  try {
    // Fetch top 3 bestsellers from the database
    let pool = await sql.connect(dbConfig);
    const result = await pool.query(`
      SELECT TOP 2 
          p.productId, 
          p.productName, 
          p.productPrice, 
          SUM(op.quantity) AS totalSold
      FROM orderproduct op
      JOIN product p ON op.productId = p.productId
      GROUP BY p.productId, p.productName, p.productPrice
      ORDER BY totalSold DESC;
    `);

    bestsellers = result.recordset; // Store the fetched data
  } catch (err) {
    console.error("Error fetching bestsellers:", err);
  }

  res.render("index", {
    title: "Batik Fusion",
    username: username, // Pass username to template
    bestsellers: bestsellers, // Pass bestsellers to template
  });
});

module.exports = router;
