const express = require("express");
const router = express.Router();
const auth = require("../auth"); // Include auth middleware
const sql = require("mssql");

router.get("/", function (req, res, next) {
  // Include authentication check
  if (!req.session || !req.session.username) {
    res.redirect("/login"); // Redirect to login if the user is not authenticated
    return;
  }

  res.setHeader("Content-Type", "text/html");

  (async function () {
    try {
      let pool = await sql.connect(dbConfig);

      // SQL query to calculate total order amounts grouped by day
      const query = `
                SELECT 
                    CAST(orderDate AS DATE) AS orderDate, 
                    SUM(totalAmount) AS totalOrderAmount
                FROM ordersummary
                GROUP BY CAST(orderDate AS DATE)
                ORDER BY orderDate
            `;

      const result = await pool.request().query(query);

      // Display the report
      res.write(`
                <html>
                <head>
                    <title>Administrator Sales Report</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            background-color: #f9f9f9;
                        }
                        h1 {
                            color: #2E7D32;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            padding: 10px;
                            text-align: left;
                            border: 1px solid #ccc;
                        }
                        th {
                            background-color: #2E7D32;
                            color: white;
                        }
                        tr:nth-child(even) {
                            background-color: #f2f2f2;
                        }
                        a {
                            text-decoration: none;
                            color: #2E7D32;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <h1>Administrator Sales Report by Day</h1>
                    <table>
                        <tr>
                            <th>Order Date</th>
                            <th>Total Order Amount</th>
                        </tr>
            `);

      // Loop through query results and generate table rows
      result.recordset.forEach((row) => {
        res.write(`
                    <tr>
                        <td>${row.orderDate}</td>
                        <td>$${row.totalOrderAmount.toFixed(2)}</td>
                    </tr>
                `);
      });

      res.write(`
                    </table>
                    <br>
                    <a href="/">Back to Main Page</a>
                </body>
                </html>
            `);

      res.end();
    } catch (err) {
      console.error("Error retrieving sales report:", err);
      res.write("<p>Error retrieving sales report.</p>");
      res.end();
    }
  })();
});

module.exports = router;
