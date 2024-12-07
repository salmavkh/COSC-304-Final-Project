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
        </style>
    </head>
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
