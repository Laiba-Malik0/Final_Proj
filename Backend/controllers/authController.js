const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP LOGIC
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Password ko encrypt karna
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User Created Successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// LOGIN LOGIC
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '60d' });
        res.status(200).json({ token, user: { id: user._id, name: user.name } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};