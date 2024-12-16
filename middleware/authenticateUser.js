const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const authenticateUser = (req, res, next) => {
    // const token = req.cookies.token;
    const authHeader = req.headers["authorization"];
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).jsib({message: "Authorization token missing or invalid"});
    }
    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(error){
        return res.status(403).json({message: "Invalid Token"});
    }
};

module.exports = authenticateUser;