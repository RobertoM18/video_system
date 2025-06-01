const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user");
const { validate } = require("../middleware/validation");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("lastname").notEmpty().withMessage("Lastname is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    validate,
  ],
  userController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
    validate,
  ],
  userController.login
);

module.exports = router;