const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "harryisagodd$boy";

//Route1:  Creating a user using :POST:"/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("email", "Enter the valid Email").isEmail(),
    // body("design", "Enter the valid Designation").isLength({ min: 5 }),
    body("name", "Enter the valid Name").isLength({ min: 3 }),
    body("password", "Password should be of 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;

    //if there are errors return bad requests and the errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    //Check wheather the user with the email exist already
    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({ success, error: "sorry a user with this email exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      //create a new user
      user = await User.create({
        name: req.body.name,
        design: req.body.design,
        email: req.body.email,
        password: secPass,
      });

      //   .then((user) => res.json(user))
      //   .catch((err) => {
      //     console.log(err);
      //     res.json({ error: "Please enter a valid value for email" });
      //   });
      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
//Route2:  Authenticating a user using :POST:"/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter the valid Email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;

    //if there are errors return bad requests and the errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, design, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Please login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route2:  Get logged-in user Details :POST:"/api/auth/getuser". login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    // success = true;
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
