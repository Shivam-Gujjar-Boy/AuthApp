const jwt = require("jsonwebtoken");
require("dotenv").config();

//for authentication
exports.auth = (req, res, next) => {
  try {
    //extract token form request body.. there are many ways to extract token
    const { token } = req.body;

    //if token is not found
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token no found",
      });
    }

    //if token is found then verify it
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);

      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: "Failed to authorize",
    });
  }
};

//for authorization as a student
exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(401).json({
        success: false,
        message: "Not a student",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: "Verification was not successful",
    });
  }
};

//for authorization as an admin
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Not an admin",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: "Verification was not successful",
    });
  }
};
