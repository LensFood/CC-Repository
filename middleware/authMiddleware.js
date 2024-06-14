const admin = require('../config/firebaseAdmin'); // Adjust the path as necessary

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(403).send({ message: 'No token provided.' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    res.status(403).send({ message: 'Could not verify token.' });
  }
};

module.exports = verifyToken;