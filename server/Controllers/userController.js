const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
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
            return res.status(400).json("All fields are required...");
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json("Email must be a valid email...");
        }

        // Validate password strength
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json("Password must be a strong password...");
        }

        // Check if user already exists
        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json("User with given email already exists...");
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
        res.status(500).json("Internal Server Error");
    }
};

const loginUser = async(req, res) => {
    const { email, password } = req.body;

    try{
        let user = await userModel.findOne({ email });

        if(!user) return res.status(400).json("Invalid emaill or password...")
        
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) return res.status(400).json("Invalid emaill or password...")

        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, name: user.name, email, token });
    }catch(error){ 
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
};

const findUser = async(req, res) =>{
    const userId = req.params.userId;
    try{
        const user = await userModel.findById(userId);

        res.status(200).json(user);
    }catch(error){
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
};

const getUsers = async(req, res) =>{
    
    try{
        const users = await userModel.find();

        res.status(200).json(users);
    }catch(error){
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
};
module.exports = { registerUser , loginUser, findUser, getUsers };
