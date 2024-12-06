const express = require("express");
const router = express.Router();
const sql = require("mssql");
const auth = require("../auth");

router.get("/", function (req, res, next) {
  if (!auth.checkAuthentication(req, res)) {
    return;
  }
  res.setHeader("Content-Type", "text/html");

  if(!req.query.edit){(async function () {
      if(!req.query.errorMsgid){try {
        let pool = await sql.connect(dbConfig);
        let username = req.session.username;
  
        const query = `SELECT * FROM customer WHERE userid = @username`;
        const result = await pool
          .request()
          .input("username", sql.VarChar, username)
          .query(query);
  
        if (result.recordset.length === 1) {
          const customer = result.recordset[0];
  
          res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Customer Dashboard</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: white;
                        color: black;
                        display: flex;
                        justify-content: center;
                    }
                    .container {
                        max-width: 1200px;
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    h1 {
                        font-size: 2rem;
                        margin-bottom: 20px;
                    }
                    .profile-link {
                        margin-bottom: 20px;
                    }
                    .profile-link a {
                        text-decoration: none;
                        font-size: 1rem;
                        color: black;
                    }
                    .profile-link a:hover {
                        text-decoration: underline;
                    }
                    .customer-info {
                        text-align: left;
                        width: 100%;
                    }
                    .customer-info table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 40px;
                    }
                    .customer-info td {
                        padding: 10px 0;
                    }
                    .customer-info td:first-child {
                        font-weight: bold;
                    }
                    .logout-container {
                        width: 100%;
                        display: flex;
                        justify-content: flex-end;
                    }
                    .logout-btn {
                        padding: 10px 20px;
                        font-size: 1rem;
                        color: black;
                        background: white;
                        border: 1px solid black;
                        border-radius: 5px;
                        text-decoration: none;
                        transition: all 0.3s ease;
                    }
                    .logout-btn:hover {
                        background: black;
                        color: white;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Hi, ${customer.firstName.toLowerCase()}!</h1>
                    <div class="profile-link">
                        <a href="/profile">Your profile</a>
                    </div>
                    <div class="customer-info">
                        <table>
                            <tr><td>ID</td><td>${customer.customerId}</td></tr>
                            <tr><td>First Name</td><td>${
                              customer.firstName
                            }</td></tr>
                            <tr><td>Last Name</td><td>${
                              customer.lastName
                            }</td></tr>
                            <tr><td>Email</td><td>${customer.email}</td></tr>
                            <tr><td>Phone</td><td>${customer.phonenum}</td></tr>
                            <tr><td>Address</td><td>${customer.address}</td></tr>
                            <tr><td>City</td><td>${customer.city}</td></tr>
                            <tr><td>State</td><td>${customer.state}</td></tr>
                            <tr><td>Postal Code</td><td>${
                              customer.postalCode
                            }</td></tr>
                            <tr><td>Country</td><td>${customer.country}</td></tr>
                            <tr><td>User ID</td><td>${customer.userid}</td></tr>
                        </table>
                             <br>
                      <a href="/">Back to Main Page</a>
                     <p> <a href="/customer?edit=${customer.customerId}">Edit Profile</a></p>

                    </div>
                    <div class="logout-container">
                        <a href="/logout" class="logout-btn">Logout</a>
                    </div>
                </div>
            </body>
            </html>
          `);
        } else {
          res.send("<p>No customer profile found.</p>");
        }
      }catch (err) {
        console.error("Error retrieving customer profile:", err);
        res.send("<p>Error retrieving customer profile.</p>");
      }}else{
        try {
          let pool = await sql.connect(dbConfig);
          let username = req.session.username;
    
          const query = `SELECT * FROM customer WHERE userid = @username`;
          const result = await pool
            .request()
            .input("username", sql.VarChar, username)
            .query(query);
    
          if (result.recordset.length === 1) {
            const customer = result.recordset[0];
    
            res.send(`
              <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Customer Dashboard</title>
                  <style>
                      body {
                          font-family: Arial, sans-serif;
                          margin: 0;
                          padding: 20px;
                          background-color: white;
                          color: black;
                          display: flex;
                          justify-content: center;
                      }
                      .container {
                          max-width: 1200px;
                          width: 100%;
                          display: flex;
                          flex-direction: column;
                          align-items: flex-start;
                      }
                      h1 {
                          font-size: 2rem;
                          margin-bottom: 20px;
                      }
                      .profile-link {
                          margin-bottom: 20px;
                      }
                      .profile-link a {
                          text-decoration: none;
                          font-size: 1rem;
                          color: black;
                      }
                      .profile-link a:hover {
                          text-decoration: underline;
                      }
                      .customer-info {
                          text-align: left;
                          width: 100%;
                      }
                      .customer-info table {
                          width: 100%;
                          border-collapse: collapse;
                          margin-bottom: 40px;
                      }
                      .customer-info td {
                          padding: 10px 0;
                      }
                      .customer-info td:first-child {
                          font-weight: bold;
                      }
                      .logout-container {
                          width: 100%;
                          display: flex;
                          justify-content: flex-end;
                      }
                      .logout-btn {
                          padding: 10px 20px;
                          font-size: 1rem;
                          color: black;
                          background: white;
                          border: 1px solid black;
                          border-radius: 5px;
                          text-decoration: none;
                          transition: all 0.3s ease;
                      }
                      .logout-btn:hover {
                          background: black;
                          color: white;
                      }
                  </style>
              </head>
              <body>
                  <div class="container">
                      <h1>Hi, ${customer.firstName.toLowerCase()}!</h1>
                      <div class="profile-link">
                          <a href="/profile">Your profile</a>
                      </div>
                      <div class="customer-info">
                          <table>
                              <tr><td>ID</td><td>${customer.customerId}</td></tr>
                              <tr><td>First Name</td><td>${
                                customer.firstName
                              }</td></tr>
                              <tr><td>Last Name</td><td>${
                                customer.lastName
                              }</td></tr>
                              <tr><td>Email</td><td>${customer.email}</td></tr>
                              <tr><td>Phone</td><td>${customer.phonenum}</td></tr>
                              <tr><td>Address</td><td>${customer.address}</td></tr>
                              <tr><td>City</td><td>${customer.city}</td></tr>
                              <tr><td>State</td><td>${customer.state}</td></tr>
                              <tr><td>Postal Code</td><td>${
                                customer.postalCode
                              }</td></tr>
                              <tr><td>Country</td><td>${customer.country}</td></tr>
                              <tr><td>User ID</td><td>${customer.userid}</td></tr>
                          </table>
                               <br>
                        <a href="/">Back to Main Page</a>
                       <p> <a href="/customer?edit=${customer.customerId}">Edit Profile</a></p>
                      <p>Failed to edit profile! try again with correct password!</p>
                      </div>
                      <div class="logout-container">
                          <a href="/logout" class="logout-btn">Logout</a>
                      </div>
                  </div>
              </body>
              </html>
            `);
          } else {
            res.send("<p>No customer profile found.</p>");
          }
        }catch (err) {
          console.error("Error retrieving customer profile:", err);
          res.send("<p>Error retrieving customer profile.</p>");
        }
      }

    
  })();}else{

    (async function () {
      try {
        // TODO: Print customer info
        let pool = await sql.connect(dbConfig);
        let username=req.session.username;
  
        // SQL query to calculate total order amounts grouped by day
        const query = `
          SELECT * FROM customer WHERE userid='${username}';
              `;
  
        const result = await pool.request().input('username', sql.VarChar, username).query(query);
        if (result.recordset.length==1){
          const customer=result.recordset[0];
          res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Customer Dashboard</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: white;
                        color: black;
                        display: flex;
                        justify-content: center;
                    }
                    .container {
                        max-width: 1200px;
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    h1 {
                        font-size: 2rem;
                        margin-bottom: 20px;
                    }
                    .profile-link {
                        margin-bottom: 20px;
                    }
                    .profile-link a {
                        text-decoration: none;
                        font-size: 1rem;
                        color: black;
                    }
                    .profile-link a:hover {
                        text-decoration: underline;
                    }
                    .customer-info {
                        text-align: left;
                        width: 100%;
                    }
                    .customer-info table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 40px;
                    }
                    .customer-info td {
                        padding: 10px 0;
                    }
                    .customer-info td:first-child {
                        font-weight: bold;
                    }
                    .logout-container {
                        width: 100%;
                        display: flex;
                        justify-content: flex-end;
                    }
                    .logout-btn {
                        padding: 10px 20px;
                        font-size: 1rem;
                        color: black;
                        background: white;
                        border: 1px solid black;
                        border-radius: 5px;
                        text-decoration: none;
                        transition: all 0.3s ease;
                    }
                    .logout-btn:hover {
                        background: black;
                        color: white;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                <form method="POST" action="/updateProfile?id=${customer.customerId}">
                    <h1>Hi, ${customer.firstName.toLowerCase()}!</h1>
                    <div class="profile-link">
                        <a href="/profile">Your profile</a>
                    </div>
                    <div class="customer-info">
                        <table>
                            <tr><td>ID</td><td>${customer.customerId}</td></tr>
                            <tr><td>First Name</td><td><input type="text" name="newfName" size="20" value=${customer.firstName}></td></tr>
                            <tr><td>Last Name</td><td><input type="text" name="newlName" size="20" value=${customer.lastName}></td></tr>
                            <tr><td>Email</td><td>${customer.email}</td></tr>
                    <tr><td>Phone</td><td><input type="tel" name="newpnum" size="20" value=${customer.phonenum}></td></tr>
                    <tr><td>Address</td><td><input type="text" name="newaddress" size="20" value=${customer.address}></td></tr>
                    <tr><td>City</td><td><input type="text" name="newcity" size="20" value=${customer.city}></td></tr>
                    <tr><td>State</td><td><input type="text" name="newstate" size="20" value=${customer.state}></td></tr>
                    <tr><td>Postal Code</td><td><input type="text" name="newpcode" size="20" value=${customer.postalCode}></td></tr>
                    <tr><td>Country</td><td><input type="text" name="newcountry" size="20" value=${customer.country}></td></tr>
                            <tr><td>User ID</td><td>${customer.userid}</td></tr>
                             <tr><td>New Password</td><td><input type="password" name="newpassword" size="20" value=${customer.password}></td></tr>
                              <tr><td>Old Password for Verification: </td><td><input type="password" name="oldpassword" placeholder="old password" required></td></tr>
                        </table>
                        
                    </div>
                    <button type="submit" class="save-button">Save Changes</button>

                </div>
            </body>
            </html>
          `);}
          res.end();
        
      } catch (err) {
        console.error("Error retrieving customer profile:", err);
        res.write("<p>Error retrieving customer profile.</p>");
        res.end();
      }
    })();
  }
});

module.exports = router;
