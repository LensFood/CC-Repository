const db = require('../models');
const { admin } = require('../config/firebase');
const User = db.User;
const firestore = admin.firestore();

// Register a new User
exports.registerUser = (req, res) => {
    // Validate request
    if (!req.body.email || !req.body.password || !req.body.name || !req.body.weight || !req.body.height) {
        res.status(400).send({ message: "Name, email, password, weight, and height are required!" });
        return;
    }

    // Check if the email is already registered
    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (user) {
                res.status(400).send({ message: "Email is already in use!" });
            } else {
                // Create a new user
                const newUser = {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    weight: req.body.weight,
                    height: req.body.height
                };

                // Save the new user to Firestore
                firestore.collection('users').doc(req.body.email).set(newUser)
                    .then(() => {
                        // Save the new user to MySQL
                        User.create(newUser)
                            .then(data => {
                                res.status(201).send(data);
                            })
                            .catch(err => {
                                res.status(500).send({ message: err.message || "Some error occurred while creating the User." });
                            });
                    })
                    .catch(err => {
                        res.status(500).send({ message: err.message || "Some error occurred while creating the User." });
                    });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while checking the email." });
        });
};

// Login User
exports.loginUser = (req, res) => {
    // Validate request
    if (!req.body.email || !req.body.password) {
        res.status(400).send({ message: "Email and password are required!" });
        return;
    }

    // Find the user by email
    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (!user) {
                res.status(404).send({ message: "User not found!" });
                return;
            }

            // Check if the password matches
            if (user.password !== req.body.password) {
                res.status(401).send({ message: "Invalid password!" });
                return;
            }

            res.send({ message: "Login successful!" });
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while logging in." });
        });
};

// Create and Save a new User
exports.createUser = (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.email || !req.body.weight || !req.body.height) {
        res.status(400).send({ message: "All fields are required!" });
        return;
    }

    // Create a User
    const user = {
        name: req.body.name,
        email: req.body.email,
        weight: req.body.weight,
        height: req.body.height
    };

    // Save User in the database
    User.create(user)
        .then(data => {
            res.status(201).send(data); // Use status 201 for successful creation
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while creating the User." });
        });
};

// Get a User by the id in the request
exports.getUser = (req, res) => {
    const id = req.query.id;

    User.findByPk(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "User not found with id=" + id });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving User with id=" + id });
        });
};

// Update a User by the id in the request
exports.updateUser = (req, res) => {
    const id = req.query.id;

    User.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({ message: "User was updated successfully." });
            } else {
                res.status(404).send({ message: `Cannot update User with id=${id}. User not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating User with id=" + id });
        });
};
