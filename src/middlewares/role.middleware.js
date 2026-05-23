// NOTE: This is client-side only protection for now.
// In production, implement proper JWT-based authentication.
// 
// For proper implementation:
// 1. npm install jsonwebtoken
// 2. Add JWT verification in middleware
// 3. Check role from decoded token

/**
 * Admin check middleware (placeholder)
 * Currently passes through all requests - implement JWT for production
 */
const checkAdmin = (req, res, next) => {
  // Placeholder: In production, verify JWT token from Authorization header
  // and check if user.role === 'admin'
  // 
  // Example:
  // const token = req.headers.authorization?.split(' ')[1];
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // if (decoded.role !== 'admin') {
  //   return res.status(403).json({ message: 'Admin access required' });
  // }
  // req.user = decoded;
  
  // For now: Allow all requests (client-side protection only)
  next();
};

module.exports = checkAdmin;