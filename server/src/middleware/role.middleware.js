
export function requireRole(...allowedRoles) {
    return (req, res, next) => {
        // Check whether the user is authenticated
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please log in first.",
            });
        }

        // Check whether the user's role is allowed
        if (!allowedRoles.includes(req.user.role.toLowerCase())) {
            return res.status(403).json({
                success: false,
                message: "Forbidden. You don't have permission to access this resource.",
            });
        }

        next();
    };
}
