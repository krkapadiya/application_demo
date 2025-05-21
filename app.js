//Implement and define express
const express = require("express");
require("body-parser");
const app = express();
const path = require("path");

// Set EJS as the view engine
app.set("view engine", "ejs");

// Set the views directory (where your .ejs files are located)
app.set("views", path.join(__dirname, "views"));

app.use("/uploads", express.static("public/uploads/")); // Serve static files from 'public' folder

require("dotenv").config();

//Implement Routes product
const router = require(`./Routes/employeeroutes`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.use((req, res) => {
  res.status(400).json("invalid route");
});

//Define port
const port = process.env.PORT || 1900;

//Server running on 5050 port
app.listen(port, () => {
  console.log(`Server running on ${port}.`);
});
//

