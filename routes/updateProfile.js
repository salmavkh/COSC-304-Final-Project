const express = require("express");
const router = express.Router();
const auth = require("../auth");
const sql = require("mssql");

router.post("/", async function (req, res) {
    const firstName=req.body.newfName;
    const lastName=req.body.newlName;
    const phonenum=req.body.newpnum;
    const address=req.body.newaddress;
    const city=req.body.newcity;
    const state=req.body.newstate;
    const postalCode=req.body.newpcode;
    const country=req.body.newcountry;
    const customerId=req.query.id;
    const password=req.body.newpassword;
    const oldpassword=req.body.oldpassword;
    try
    {let pool=await sql.connect(dbConfig);
        const query = `SELECT * FROM customer WHERE customerId = @userid`;
        const result = await pool
          .request()
          .input("userid", sql.Int, customerId)
          .query(query);
          const customer = result.recordset[0];
          if(customer.password===oldpassword)
   { const createAccountQuery=await sql.query`UPDATE customer 
    SET
    firstName=${firstName},
    lastName=    ${lastName},
    phonenum  =  ${phonenum},
    address=    ${address},
    city=    ${city},
    state=    ${state},
    postalCode  =  ${postalCode},
    country=    ${country},
    password=${password}
    WHERE customerId=${customerId} AND password=${oldpassword}`;
    res.redirect("/customer");} // Redirect to the login page
    else{res.redirect("/customer?errorMsgid=3")}
}catch (err) {
        console.error("Database query error:", err);
        res.write("<p>Error retrieving orders.</p>");
      } finally {
        sql.close();
      }

});

module.exports = router;