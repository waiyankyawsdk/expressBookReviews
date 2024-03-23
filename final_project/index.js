const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

const auth = (req, res, next) => {
    if (req.session.authorization) {
        token = req.session.authorization['token'];
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            }
            else {
                return res.status(403).json({ message: "User not authenticated" })
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" })
    }
}

app.use(express.json());

app.use("/", genl_routes);
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer", customer_routes);
app.use("/customer/auth/*", auth, customer_routes);

const PORT = 5000;

app.listen(PORT, () => console.log("Server is running"));
