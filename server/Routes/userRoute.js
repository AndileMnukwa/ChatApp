const express = require("express");
const {registerUser} = require("../Controllers/userController");

const router = express.Router();

router.post("/register", (req, res) =>{
    res.send("Register");
});

module.exports = router;