"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUnreadMessages = exports.getListOfUsers = exports.logout = exports.getUser = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_models_1 = __importDefault(require("./user.models"));
const jwtConfig_1 = require("../../config/jwtConfig");
const conversation_model_1 = __importDefault(require("../conversations/conversation.model"));
const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(409).json({ message: "אחד השדות חסרים" });
        }
        // Check if the email is already registered in Airtable
        // const usersInAirtable = await base('contacts').select({
        //   filterByFormula: `{Email} = '${email}'`,
        // }).all();
        // if (usersInAirtable.length === 0) {
        //   return res.status(409).json({ message: "איימיל זה לא קיים במאגר המתנדבים" });
        // }
        // Check if the email is already registered in MongoDB
        const existingUser = await user_models_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "איימיל זה  קיים במערכת" });
        }
        // Hash the password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create a new user in MongoDB
        const newUser = new user_models_1.default({
            email,
            password: hashedPassword,
            role: 'volunteer'
        });
        // Save the user to the database
        const savedUser = await newUser.save();
        // Generate a JWT
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id, role: 'volunteer' }, jwtConfig_1.jwtSecret, {
            expiresIn: "1d",
        });
        // Set the token as a cookie
        res.cookie("token", token, { httpOnly: true, secure: true });
        res.status(201).json({ user: savedUser, message: "ההרשמה בוצעה בהצלחה" });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "ההרשמה נכשלה" });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(409).json({ message: "אחד השדות חסרים" });
        }
        // // Check if the email is already registered in Airtable
        // const usersInAirtable = await base('contacts').select({
        //   filterByFormula: `{Email} = '${email}'`,
        // }).all();
        // if (usersInAirtable.length === 0) {
        //   return res.status(409).json({ message: "איימיל זה לא קיים במאגר המתנדבים" });
        // }
        const user = await user_models_1.default.findOne({ email });
        if (!user) {
            res.status(400).send({
                message: "ההתחברות נכשלה: איימיל לא קיים , צריך להירשם",
            });
        }
        else {
            const matchPassword = await bcrypt_1.default.compare(password, user.password);
            if (matchPassword) {
                const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, jwtConfig_1.jwtSecret, {
                    expiresIn: "1h",
                });
                const modifiedUser = { role: user.role, ...user.toObject(), password: undefined };
                res.cookie("token", token, { httpOnly: true, secure: true });
                res.status(200).send({ message: "ההתחברות בוצעה בהצלחה", user: modifiedUser, token });
            }
            else {
                res.status(401).send({ message: "ההתחברות נכשלה :סיסמה שגויה" });
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: "ההתחברות נכשלה" });
    }
};
exports.login = login;
const getUser = async (req, res) => {
    const { userId } = req.user;
    try {
        const user = await user_models_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Don't send the password back
        const userResponse = user.toObject();
        userResponse.password = undefined;
        res.json(userResponse);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching user' });
    }
};
exports.getUser = getUser;
const logout = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie("token");
        res.status(200).json({ message: "התנתקות בוצעה בהצלחה" }); // Logged out successfully
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "התנתקות נכשלה" }); // Logout failed
    }
};
exports.logout = logout;
const getListOfUsers = async (req, res) => {
    const { list } = req.body;
    try {
        const users = await Promise.all(list.map(async (user) => {
            const conversation = await conversation_model_1.default.findOne({ users: user }).populate("transcript.sender");
            if (!conversation) {
                const userData = await user_models_1.default.findById(user).select("-password"); // Assuming you have a User model
                if (userData)
                    return {
                        ...userData.toObject(),
                        hasUnreadMessages: false,
                    };
            }
            const unreadMessages = conversation?.transcript.filter((message) => !message.seenBy);
            const userData = await user_models_1.default.findById(user).select("-password"); // Assuming you have a User model
            if (userData)
                return {
                    ...userData.toObject(),
                    hasUnreadMessages: unreadMessages ? unreadMessages.length > 0 : false,
                };
        }));
        res.status(200).json({ users });
    }
    catch (error) {
        console.error("Fetching users error:", error);
        res.status(500).json({ error: "כשל במשיכת הנתונים" });
    }
};
exports.getListOfUsers = getListOfUsers;
const checkUnreadMessages = async (req, res) => {
    try {
        // Extract user ID, modify this based on your authentication setup
        const userId = req.user.userId;
        // Find a conversation where the user is a participant, they are not the sender,
        // and they have not seen the message
        const conversation = await conversation_model_1.default.findOne({
            users: userId,
            transcript: {
                $elemMatch: {
                    sender: { $ne: userId },
                    seenBy: { $ne: userId }
                }
            }
        });
        // If such a conversation exists, the user has unread messages
        const hasUnreadMessages = Boolean(conversation);
        return res.status(200).json({ hasUnreadMessages });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.checkUnreadMessages = checkUnreadMessages;
