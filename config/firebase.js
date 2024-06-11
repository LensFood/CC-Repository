const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

//Access Firebase services
const firestore = admin.firestore();
const storage = admin.storage();

// Export the Firebase Admin SDK modules
module.exports = {
    admin,
    firestore,
    storage
};