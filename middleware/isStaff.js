// Middleware to check staff role
// const isStaff = (req, res, next) => {
//     const userRole = req.headers["role"];
//     if (userRole !== 'staff') {
//         return res.status(403).json({ message: 'Forbidden: Staff access only' });
//     }
//     next();
// };
const isStaff = (req, res, next) => {
    if (req.user.role !== 'staff') {
        return res.status(403).json({ message: 'Forbidden: Staff access only' });
    }
    next();
};

module.exports = isStaff;