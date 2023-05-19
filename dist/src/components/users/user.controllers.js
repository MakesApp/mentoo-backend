"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_models_1 = __importDefault(require("./user.models"));
const jwtConfig_1 = require("../../config/jwtConfig");
const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the email is already registered
        if (!email || !password) {
            return res.status(409).json({ error: "Missing Credentials" });
        }
        const existingUser = await user_models_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already registered" });
        }
        // Hash the password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create a new user
        const newUser = new user_models_1.default({
            email,
            password: hashedPassword,
        });
        // Save the user to the database
        const savedUser = await newUser.save();
        // Generate a JWT
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, jwtConfig_1.jwtSecret, {
            expiresIn: "1d",
        });
        // Set the token as a cookie
        res.cookie("token", token, { httpOnly: true, secure: true });
        res.status(201).json({ user: savedUser, message: "Registration successful" });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Registration failed" });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await user_models_1.default.findOne({ email });
        if (!user) {
            res.send({
                message: "Login failed: email doesn't exist, register first",
            });
        }
        else {
            const matchPassword = await bcrypt_1.default.compare(password, user.password);
            if (matchPassword) {
                const token = jsonwebtoken_1.default.sign({ email }, jwtConfig_1.jwtSecret, {
                    expiresIn: "1h",
                });
                const modifiedUser = { ...user.toObject(), password: undefined };
                res.cookie("token", token, { httpOnly: true });
                res.status(200).send({ message: "Login successful", user: modifiedUser });
            }
            else {
                res.status(401).send({ message: "Login failed: Incorrect password" });
            }
        }
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
};
exports.login = login;
