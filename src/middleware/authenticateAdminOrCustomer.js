const jwt = require("jsonwebtoken");

function authenticateAdminOrCustomer(req, res, next) {

    const authHeader = req.headers.authorization;

    if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
    ) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role === "admin") {

            req.admin = decoded;
            req.authType = "admin";

            return next();
        }

        if (decoded.role === "authenticated") {

            req.customer = decoded;
            req.authType = "customer";

            return next();
        }

        return res.status(403).json({
            message: "Access denied",
        });

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token",
        });

    }
}

module.exports = authenticateAdminOrCustomer;