// Mock authentication middleware for testing purposes
module.exports.mockUser = (req, res, next) => {
    // Mock user data for testing
    req.user = {
        id: "test_user_1",
        fullName: "Nguyễn Văn A",
        email: "test@example.com",
        phone: "0123456789"
    };
    next();
};
