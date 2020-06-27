const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.body.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "padamchopraisgreatandhecofoundedtechsyndicate");
        req.username = decoded.username;
    } catch (error) {
        return res.status(401).json({
            message: 'Login again for security purposes'
        });
    }
    next();
};