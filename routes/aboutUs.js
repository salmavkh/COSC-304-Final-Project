const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>About Us - Batik Fusion</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                padding: 20px;
                background-color: #fff;
                color: #333;
                text-align: left;
                max-width: 900px;
                margin: auto;
            }
            h1 {
                font-size: 2.5rem;
                margin-bottom: 20px;
                color: #000;
            }
            p {
                font-size: 1.2rem;
                line-height: 1.6;
                margin-bottom: 20px;
            }
            hr {
                margin: 30px 0;
                border: none;
                border-top: 1px solid #ddd;
            }
            .internal-links {
                margin-top: 20px;
            }
            .internal-links h2 {
                font-size: 1.8rem;
                margin-bottom: 15px;
                color: #000;
            }
            .link-button {
                display: inline-block;
                margin-top: 10px;
                font-size: 1rem;
                text-decoration: none;
                color: black;
                border: 1px solid black;
                padding: 10px 20px;
                border-radius: 5px;
                transition: all 0.3s ease;
            }
            .link-button:hover {
                background-color: black;
                color: white;
            }
                header {
    position: sticky;
    top: 0; /* Stick to the top of the viewport */
    z-index: 1000; /* Ensure it stays on top of other elements */
    background-color: #fff; /* Optional: Background to avoid transparency */
    border-bottom: 1px solid #ddd; /* Optional: Add a border for better visibility */
    margin-bottom: 50px;
padding-bottom: 20px;
}

.container {
    display: flex;
    justify-content: space-between; /* Spaces elements evenly */
    align-items: center; /* Centers items vertically */
}

.logo {
    font-weight: bold;
    font-size: 1.2rem;
}

nav ul {
    display: flex;
    gap: 1.5rem; /* Adds space between navigation links */
    list-style: none;
    margin: 0;
    padding: 0;
}

nav ul li a {
    text-decoration: none; /* Removes underline */
    color: #333; /* Neutral dark color */
    font-size: 1rem;
}

.actions a {
    margin-left: 1rem;
    text-decoration: none;
    font-size: 1rem;
    color: #333;
}
        </style>
    </head>
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
    <body>
        <h1>About Us</h1>
        <p>
            At Batik Fusion, we are passionate about bringing the timeless beauty and intricate craftsmanship of Indonesian batik to Canada. Founded with the vision of blending tradition with modern style, our goal is to introduce Canadians to the rich history and artistry of batik through authentic, handcrafted fabrics.
        </p>
        <p>
            Each piece we offer is meticulously crafted by skilled artisans, using traditional techniques passed down through generations. Our curated selection of premium batik fabrics is designed to inspire creativity, whether for everyday sewing projects, bespoke designs, or statement pieces.
        </p>
        <p>
            We believe in more than just fabric—we are connecting cultures, celebrating heritage, and supporting the artisans who make this exquisite art form possible. Our customers are individuals who value unique, culturally rich materials, and share our appreciation for creativity and quality.
        </p>
        <p>
            At Batik Fusion, we’re more than a fabric shop—we’re a bridge between tradition and innovation, artistry and modern design. Join us in celebrating the beauty of batik and the stories it tells.
        </p>

        <hr />

        <div class="internal-links">
            <h2>Internal Links</h2>
            <a href="/admin" class="link-button">Administration Portal</a>
            <a href="/listorder" class="link-button">List Order</a>
        </div>
    </body>
    </html>
  `);
});

module.exports = router;
