const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

app.use(express.json());

//import routes
const user = require("./routes/user");
//mounting routes
app.use("/api/v1", user);

app.listen(PORT, () => {
  console.log(`App started at ${PORT}`);
});

const dbConnect = require("./config/database");
dbConnect();

//default route
app.get("/", (req, res) => {
  res.send(`<h1> Authentication and Authorization </h1>`);
});
