const express = require("express");
const router = express.Router();
const sql = require("mssql");
const auth = require("../auth");

router.get("/", function (req, res, next) {
  if (!auth.checkAuthentication(req, res)) {
    return;
  }
  res.setHeader("Content-Type", "text/html");

  if (!req.query.edit) {
    (async function () {
      if (!req.query.errorMsgid) {
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
/* General body styling */
body {
    font-family: Arial, sans-serif;
    margin-top: 50px;
    padding: 0;
    background-color: white;
    color: black;
    padding-top: 20px;
}

/* Container for the entire content */
.container {
    max-width: 900px; /* Restrict content width to 900px */
    width: 100%;
    margin: 0 auto; /* Center the container horizontally */
    padding: 20px; /* Add padding inside the boundary */
    box-sizing: border-box;
    text-align: left; /* Align text within the container to the left */
}

/* Header */
header {
    position: fixed; /* Stick header to the top */
    top: 0; /* Position it at the top of the page */
    left: 0;
    width: 100%; /* Make it span the full width of the viewport */
    z-index: 1000;
    background-color: #fff;
    border-bottom: 1px solid #ddd; /* Add a subtle border below the header */
    padding: 10px 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

header .container {
    max-width: 900px; /* Match the content boundary */
    margin: 0 auto;
    display: flex;
    justify-content: space-between; /* Space between logo and nav */
    align-items: center;
}

/* Logo */
header .logo {
    font-weight: bold;
    font-size: 1.5rem; /* Increase font size */
    text-decoration: none;
    color: #000;
}

/* Navigation menu */
header nav ul {
    display: flex; /* Arrange navigation items in a row */
    gap: 1.5rem; /* Add space between links */
    list-style: none;
    margin: 0;
    padding: 0;
}

header nav ul li a {
    text-decoration: none; /* Remove underline */
    color: #333;
    font-size: 1rem;
    transition: color 0.3s ease;
}

header nav ul li a:hover {
    color: #007BFF; /* Change color on hover */
}

/* Profile header */
h1 {
    font-size: 2rem;
    margin-bottom: 20px;
}

/* Profile links (Edit, Logout, etc.) */
.profile-link {
    margin-bottom: 20px;
}

.profile-link a {
    text-decoration: none;
    font-size: 1rem;
    color: black;
    margin-right: 20px;
}

.profile-link a:hover {
    text-decoration: underline;
}

/* Customer information table */
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
    padding: 10px 5px; /* Add spacing for readability */
}

.customer-info td:first-child {
    font-weight: bold; /* Highlight the labels */
    width: 30%; /* Restrict the width for labels */
}

.customer-info td:last-child {
    width: 70%; /* Use remaining space for content */
}

/* Logout button */
.logout-container {
    width: 100%;
    display: flex;
    justify-content: flex-end; /* Align logout button to the right */
    margin-top: 20px; /* Add spacing above the button */
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
                    <header>
        <div class="container">
            <div class="logo"><a href="/" style="color: black; text-decoration:none;">Batik Fusion</a></div>
            <nav>
                <ul>
                    <li><a href="/listprod">Products</a></li>
                    <li><a href="/recommendMe">Recommend Me</a></li>
                    <li><a href="/aboutUs">About Us</a></li>
                </ul>
            </nav>
            <div class="actions">
                <a href="/showcart" class="cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 19.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5zm3.5-1.5c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm6.305-15l-3.432 12h-10.428l-2.937-7h11.162l-1.412 5h2.078l1.977-7h-16.813l4.615 11h13.239l3.474-12h1.929l.743-2h-4.195z"/></svg>
                </a>
                <a href="/customer" class="cart"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm8.127 19.41c-.282-.401-.772-.654-1.624-.85-3.848-.906-4.097-1.501-4.352-2.059-.259-.565-.19-1.23.205-1.977 1.726-3.257 2.09-6.024 1.027-7.79-.674-1.119-1.875-1.734-3.383-1.734-1.521 0-2.732.626-3.409 1.763-1.066 1.789-.693 4.544 1.049 7.757.402.742.476 1.406.22 1.974-.265.586-.611 1.19-4.365 2.066-.852.196-1.342.449-1.623.848 2.012 2.207 4.91 3.592 8.128 3.592s6.115-1.385 8.127-3.59zm.65-.782c1.395-1.844 2.223-4.14 2.223-6.628 0-6.071-4.929-11-11-11s-11 4.929-11 11c0 2.487.827 4.783 2.222 6.626.409-.452 1.049-.81 2.049-1.041 2.025-.462 3.376-.836 3.678-1.502.122-.272.061-.628-.188-1.087-1.917-3.535-2.282-6.641-1.03-8.745.853-1.431 2.408-2.251 4.269-2.251 1.845 0 3.391.808 4.24 2.218 1.251 2.079.896 5.195-1 8.774-.245.463-.304.821-.179 1.094.305.668 1.644 1.038 3.667 1.499 1 .23 1.64.59 2.049 1.043z"/></svg></a>
                    


            </div>
        </div>
    </header>
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
                            <tr><td>Address</td><td>${
                              customer.address
                            }</td></tr>
                            <tr><td>City</td><td>${customer.city}</td></tr>
                            <tr><td>State</td><td>${customer.state}</td></tr>
                            <tr><td>Postal Code</td><td>${
                              customer.postalCode
                            }</td></tr>
                            <tr><td>Country</td><td>${
                              customer.country
                            }</td></tr>
                            <tr><td>User ID</td><td>${customer.userid}</td></tr>
                        </table>
                             <br>
                      <a href="/">Back to Main Page</a>
                     <p> <a href="/customer?edit=${
                       customer.customerId
                     }">Edit Profile</a></p>

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
        } catch (err) {
          console.error("Error retrieving customer profile:", err);
          res.send("<p>Error retrieving customer profile.</p>");
        }
      } else {
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
                              <tr><td>ID</td><td>${
                                customer.customerId
                              }</td></tr>
                              <tr><td>First Name</td><td>${
                                customer.firstName
                              }</td></tr>
                              <tr><td>Last Name</td><td>${
                                customer.lastName
                              }</td></tr>
                              <tr><td>Email</td><td>${customer.email}</td></tr>
                              <tr><td>Phone</td><td>${
                                customer.phonenum
                              }</td></tr>
                              <tr><td>Address</td><td>${
                                customer.address
                              }</td></tr>
                              <tr><td>City</td><td>${customer.city}</td></tr>
                              <tr><td>State</td><td>${customer.state}</td></tr>
                              <tr><td>Postal Code</td><td>${
                                customer.postalCode
                              }</td></tr>
                              <tr><td>Country</td><td>${
                                customer.country
                              }</td></tr>
                              <tr><td>User ID</td><td>${
                                customer.userid
                              }</td></tr>
                          </table>
                               <br>
                        <a href="/">Back to Main Page</a>
                       <p> <a href="/customer?edit=${
                         customer.customerId
                       }">Edit Profile</a></p>
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
        } catch (err) {
          console.error("Error retrieving customer profile:", err);
          res.send("<p>Error retrieving customer profile.</p>");
        }
      }
    })();
  } else {
    (async function () {
      try {
        // TODO: Print customer info
        let pool = await sql.connect(dbConfig);
        let username = req.session.username;

        // SQL query to calculate total order amounts grouped by day
        const query = `
          SELECT * FROM customer WHERE userid='${username}';
              `;

        const result = await pool
          .request()
          .input("username", sql.VarChar, username)
          .query(query);
        if (result.recordset.length == 1) {
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
                <form method="POST" action="/updateProfile?id=${
                  customer.customerId
                }">
                    <h1>Hi, ${customer.firstName.toLowerCase()}!</h1>
                    <div class="profile-link">
                        <a href="/profile">Your profile</a>
                    </div>
                    <div class="customer-info">
                        <table>
                            <tr><td>ID</td><td>${customer.customerId}</td></tr>
                            <tr><td>First Name</td><td><input type="text" name="newfName" size="20" value=${
                              customer.firstName
                            }></td></tr>
                            <tr><td>Last Name</td><td><input type="text" name="newlName" size="20" value=${
                              customer.lastName
                            }></td></tr>
                            <tr><td>Email</td><td>${customer.email}</td></tr>
                    <tr><td>Phone</td><td><input type="tel" name="newpnum" size="20" value=${
                      customer.phonenum
                    }></td></tr>
                    <tr><td>Address</td><td><input type="text" name="newaddress" size="20" value=${
                      customer.address
                    }></td></tr>
                    <tr><td>City</td><td><input type="text" name="newcity" size="20" value=${
                      customer.city
                    }></td></tr>
                    <tr><td>State</td><td><input type="text" name="newstate" size="20" value=${
                      customer.state
                    }></td></tr>
                    <tr><td>Postal Code</td><td><input type="text" name="newpcode" size="20" value=${
                      customer.postalCode
                    }></td></tr>
                    <tr><td>Country</td><td><input type="text" name="newcountry" size="20" value=${
                      customer.country
                    }></td></tr>
                            <tr><td>User ID</td><td>${customer.userid}</td></tr>
                             <tr><td>New Password</td><td><input type="password" name="newpassword" size="20" value=${
                               customer.password
                             }></td></tr>
                              <tr><td>Old Password for Verification: </td><td><input type="password" name="oldpassword" placeholder="old password" required></td></tr>
                        </table>
                        
                    </div>
                    <button type="submit" class="save-button">Save Changes</button>
</form>
                </div>
            </body>
            </html>
          `);
        }
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
