const userModel = require("../Models/userModel");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const validator = require("validator");

const createToken = (_id) => {
    const jwtKey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                error: true,
                message: "All fields are required. Please provide name, email, and password."
            });
        }

        // Validate name length
        if (name.length < 3 || name.length > 30) {
            return res.status(400).json({
                error: true,
                message: "Name must be between 3 and 30 characters long."
            });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                error: true,
                message: "Please provide a valid email address."
            });
        }

        // Validate password strength
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                error: true,
                message: "Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and symbols."
            });
        }

        // Check if user already exists
        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                error: true,
                message: "An account with this email already exists. Please log in instead."
            });
        }

        // Create new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        // Generate token
        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, name, email, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: true,
            message: "Something went wrong on our end. Please try again later."
        });
    }
};

const loginUser = async(req, res) => {
    const { email, password } = req.body;

    try{
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: "Email and password are required."
            });
        }

        // Find user by email
        let user = await userModel.findOne({ email });

        // User not found
        if(!user) {
            return res.status(400).json({
                error: true,
                message: "Invalid email or password. Please try again."
            });
        }
        
        // Validate password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({
                error: true,
                message: "Invalid email or password. Please try again."
            });
        }

        // Generate and return token
        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, name: user.name, email, token });
    } catch(error){ 
        console.error(error);
        res.status(500).json({
            error: true,
            message: "Something went wrong on our end. Please try again later."
        });
    }
};

const findUser = async(req, res) => {
    const userId = req.params.userId;
    try{
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found."
            });
        }

        res.status(200).json(user);
    } catch(error){
        console.error(error);
        res.status(500).json({
            error: true,
            message: "Error fetching user details. Please try again later."
        });
    }
};

const getUsers = async(req, res) => {
    try{
        const users = await userModel.find().select('-password');

        res.status(200).json(users);
    } catch(error){
        console.error(error);
        res.status(500).json({
            error: true,
            message: "Error fetching users. Please try again later."
        });
    }
};

module.exports = { registerUser, loginUser, findUser, getUsers };