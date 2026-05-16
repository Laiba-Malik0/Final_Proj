const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "No Token, Authorization Denied" });
    }

    try {
        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // decoded se ID nikal kar req.user mein daal di
        req.user = { id: decoded.id || decoded._id }; 
        next();
    } catch (error) {
        console.log("JWT Error:", error.message);
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = protect;