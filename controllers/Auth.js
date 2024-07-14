const bcrypt = require("bcrypt");
const User = require("../models/User");

//signup route handler
exports.signup = async (req, res) => {
  try {
    //fetch data
    const { name, email, password, role } = req.body;

    //checking existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email id already exists",
      });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(
        password,
        10 /*,callback function optional, if we want to do something after password gets hashed */
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Error in hashing password",
      });
    }

    const userData = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(200).json({
      success: true,
      data: userData,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create account!!",
    });
  }
};

//as we want JWT_SECRET
require("dotenv").config();

const jwt = require("jsonwebtoken");

//login route handler
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Enter all the required details",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No such email exists",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user = user.toObject();
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        user,
        token,
        message: "Logged in successfully",
      });
    }

    res.status(401).json({
      success: false,
      message: "Wrong passord entered",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to log in",
    });
  }
};
