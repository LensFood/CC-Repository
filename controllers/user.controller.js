const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } = require('firebase/auth');
const { getFirestore, doc, setDoc, updateDoc } = require('firebase/firestore'); // Import Firestore

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDQTI06iZgNrPB_DLx4zoa1SPwVEl1Zj-c",
    authDomain: "lens-food-project.firebaseapp.com",
    projectId: "lens-food-project",
    storageBucket: "lens-food-project.appspot.com",
    messagingSenderId: "628521274677",
    appId: "1:628521274677:web:5d274e2099b629b08ed07c",
    measurementId: "G-7878KLB0E7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Get Firestore service

// Register User
exports.registUser = (req, res) => {
    const { email, password, height, weight, name } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: "Email and password are required!" });
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Directly use the user object from userCredential
    const user = userCredential.user;
    if (user) {
        // Call updateProfile on the user object directly from userCredential
        updateProfile(user, {
            displayName: name
        }).then(() => {
            // User's displayName updated
            const userRef = doc(db, "users", user.uid);
            setDoc(userRef, {
                email: email,
                height: height,
                weight: weight,
                // Reminder: It's not recommended to store passwords in Firestore
                name: name
            })
            .then(() => {
                user.getIdToken().then(idToken => {
                    res.status(201).send({
                        message: "User registered successfully",
                        userId: user.uid,
                        idToken: idToken,
                        refreshToken: user.refreshToken,
                        displayName: user.displayName
                    });
                });
            })
            .catch((error) => {
                res.status(500).send({ message: "Failed to add user data to Firestore: " + error.message });
            });
        }).catch((error) => {
            res.status(500).send({ message: "Failed to update user profile: " + error.message });
        });
    }
})
.catch((error) => {
    res.status(500).send({ message: error.message });
});
};

// Login User
exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: "Email and password are required!" });
    }

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        userCredential.user.getIdToken().then(idToken => {
            res.status(200).send({
                message: "User logged in successfully",
                userId: userCredential.user.uid,
                idToken: idToken,
                refreshToken: userCredential.user.refreshToken,
                displayName: userCredential.user.displayName
            });
        });
    })
    .catch((error) => {
        res.status(500).send({ message: error.message });
    });
};

exports.updateProfile = async (req, res) => {
    const { getAuth } = require('firebase-admin/auth');

    const idToken = req.headers.authorization?.split('Bearer ')[1]; // Extract the ID token from the Authorization header

    if (!idToken) {
        return res.status(401).send({ message: "Unauthorized" });
    }

    try {
        // Verify the ID token and extract the user ID
        const decodedToken = await getAuth().verifyIdToken(idToken);
        const userId = decodedToken.uid;

        const allowedUpdates = ['name', 'weight', 'height'];
        const updateData = {};

        // Dynamically build the update object based on the provided fields in the request body
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updateData[key] = req.body[key];
            }
        });

        if (Object.keys(updateData).length === 0) {
            return res.status(400).send({ message: "No valid update fields provided" });
        }

        // Reference to the user document in the 'users' collection
        const userRef = doc(db, 'users', userId);

        // Perform the update operation
        await updateDoc(userRef, updateData);
        res.status(200).send({ message: "User profile updated successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
// Get User Profile
// exports.getUserProfile = (req, res) => {
//     const user = req.user;
//     res.status(200).send({
//         message: "User profile retrieved successfully",
//         userId: user.uid,
//         displayName: user.displayName,
//         email: user.email,
//         height: user.height,
//         weight: user.weight
//     });
//};