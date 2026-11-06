export const getGoogleAuth = (req, res) => {
    res.json({
        success: true,
        message: "Google signup/login successful!",
        user: req.user,
        session: req.session,
    });
}

export const getTestCustomer = (req, res) => {
    res.json({
        success: true,
        message: "Signup/login successful!",
        user: req.user,
        session: req.session,
    });
}

export const getTestArtisan = (req, res) => {
    res.json({
        success: true,
        message: "Signup/login successful!",
        user: req.user,
        session: req.session,
    });
}

export const getTestAdmin = (req, res) => {
    res.json({
        success: true,
        message: "Signup/login successful!",
        user: req.user,
        session: req.session,
    });
}