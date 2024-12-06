const express = require("express");
const router = express.Router();
const auth = require("../auth");
const sql = require("mssql");

router.post("/", async function (req, res) {
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const email=req.body.email;
    const phonenum=req.body.phonenum;
    const address=req.body.address;
    const city=req.body.city;
    const state=req.body.state;
    const postalCode=req.body.postalCode;
    const country=req.body.country;
    const userid=req.body.userid;
    const password=req.body.password;
    let pool=await sql.connect(dbConfig);
        const query = `SELECT * FROM customer WHERE userid = @username`;
        const result = await pool
          .request()
          .input("username", sql.VarChar, userid)
          .query(query);
if(result.recordset.length===0)
    {try
    {await sql.connect(dbConfig);
    const createAccountQuery=await sql.query`INSERT INTO customer (firstName,
    lastName,
    email,
    phonenum,
    address,
    city,
    state,
    postalCode,
    country,
    userid,
    password) VALUES(${firstName},
    ${lastName},
    ${email},
    ${phonenum},
    ${address},
    ${city},
    ${state},
    ${postalCode},
    ${country},
    ${userid},
    ${password})`;
    res.redirect("/login?success=1"); // Redirect to the login page
}catch (err) {
        console.error("Database query error:", err);
        res.write("<p>Error retrieving orders.</p>");
      } finally {
        sql.close();
      }}else{
        res.redirect("/signuppage?error=1");
      }

});

module.exports = router;