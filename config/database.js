const mongoose = require("mongoose");

require("dotenv").config();

const dbConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("database connection successful"))
    .catch((error) => {
      console.log("There was an error connecting to database");
      console.error(error.message);
      process.exit(1);
    });
};

module.exports = dbConnect;
