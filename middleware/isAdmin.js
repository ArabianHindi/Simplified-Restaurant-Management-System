// Middleware to check admin role
//   const isAdmin = (req, res, next) => {
//     const userRole = req.headers["role"];
//     if (userRole !== 'admin') {
//         return res.status(403).json({ message: 'Forbidden: Admin access only' });
//     }
//     next();
// };

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access only' });
  }
  next();
};

module.exports = isAdmin;