const crypto = require('crypto');
const { createCanvas } = require('canvas'); 

const validateName = (name) => {
    const nameRegex = /^[A-Za-z]+$/;
    return nameRegex.test(name) && name.length <= 100;
}

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 100;
};

const validatePassword = (password, confirmPassword) => {
    return password.length >= 8 && password.length <= 16 && password === confirmPassword;
};

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

const comparePasswords = (plainPassword, hashedPassword) => {
    return hashPassword(plainPassword) === hashedPassword;
};

const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';

    for (let i = 0; i < 5; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const canvas = createCanvas(120, 40);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f7f7f7';
    ctx.fillRect(0, 0, 120, 40);

    ctx.font = '28px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(captcha, 15, 30);

    const captchaImage = canvas.toDataURL();

    return { code: captcha, image: captchaImage };
};

module.exports = { 
    validateName,
    validateEmail, 
    validatePassword, 
    hashPassword, 
    comparePasswords,
    generateCaptcha, 
};
