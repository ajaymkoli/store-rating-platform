const validateEmail = (email) => {
    // Standard email validation [cite: 67]
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
    // 8-16 chars, 1 uppercase, 1 special character [cite: 65, 66]
    const re = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    return re.test(password);
};

module.exports = { validateEmail, validatePassword };