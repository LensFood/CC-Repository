const admin = require('firebase-admin');

const verifyToken = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(403).send('Unauthorized - Missing or invalid token format');
    }

    const idToken = authorizationHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(403).send('Unauthorized - Invalid token');
    }
};

module.exports = verifyToken;
