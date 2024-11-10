const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const utils = require('./utils'); 
const db = require('./db'); 

let currentUser = null;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'GET' && parsedUrl.pathname.startsWith('/styles')) {
        const filePath = path.join(__dirname, parsedUrl.pathname);
        const extname = path.extname(filePath);
        let contentType = 'text/html'; 

        switch (extname) {
            case '.css': contentType = 'text/css'; break;
            case '.js': contentType = 'application/javascript'; break;
            case '.png': contentType = 'image/png'; break;
            case '.jpg':
            case '.jpeg': contentType = 'image/jpeg'; break;
            case '.gif': contentType = 'image/gif'; break;
            case '.svg': contentType = 'image/svg+xml'; break;
        }

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('File not found');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });

        return;
    }

    if (req.method === 'GET' && parsedUrl.pathname === '/') {
        serveHomePage(res);
    } else if (req.method === 'GET' && parsedUrl.pathname === '/register') {
        serveRegisterPage(res);
    } else if (req.method === 'POST' && parsedUrl.pathname === '/register') {
        handleRegistration(req, res);
    } else if (req.method === 'GET' && parsedUrl.pathname === '/login') {
        serveLoginPage(res);
    } else if (req.method === 'POST' && parsedUrl.pathname === '/login') {
        handleLogin(req, res);
    } else if (req.method === 'GET' && parsedUrl.pathname === '/change-profile') {
        serveChangeProfilePage(req, res);
    } else if (req.method === 'POST' && parsedUrl.pathname === '/change-profile') {
        handleProfileUpdate(req, res);
    } else if (req.method === 'GET' && parsedUrl.pathname === '/logout') {
        handleLogout(res);
    } else {
        serve404Page(res);
    }
});

const serveHomePage = (res, currentUser) => {
    fs.readFile('./templates/home.html', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('Error loading page');
            return;
        }

        let navLinks = '';
        if (currentUser) {
            navLinks = `
                <a href="/change-profile">Change profile</a>
                <a href="/logout">Logout</a>
            `;
        } else {
            navLinks = `
                <a href="/register">Register</a>
                <a href="/login">Login</a>
            `;
        }

        const html = data.replace(
            '<nav class="site-nav"></nav>', 
            `<nav class="site-nav">${navLinks}</nav>`
        );

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    });
};

const serveRegisterPage = (res) => {
    const captcha = utils.generateCaptcha();
    global.captchaCode = captcha.code;

    fs.readFile('./templates/register.html', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('Error loading page');
            return;
        }

        const html = data.replace('{{captcha_code}}', captcha.image);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    });
};

const handleRegistration = (req, res) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
        const data = querystring.parse(body);
        const { email, firstName, lastName, password, confirmPassword, captcha } = data;

        if (!utils.validateEmail(email) || !utils.validatePassword(password, confirmPassword)) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('Invalid email or password.');
            return;
        }

        if (captcha !== global.captchaCode) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('CAPTCHA mismatch. Please try again.');
            return;
        }

        const hashedPassword = utils.hashPassword(password);
        db.executeQuery(
            'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword],
            (insertResult) => {
                db.executeQuery(
                    'SELECT * FROM users WHERE id = LAST_INSERT_ID()',
                    [],
                    (userResult) => {
                        currentUser = userResult[0];
                        global.captchaCode = null;
                        serveHomePage(res, currentUser);
                    }
                );
            }
        );
    });
};

const serveLoginPage = (res) => {
    const captcha = utils.generateCaptcha();
    global.captchaCode = captcha.code;

    fs.readFile('./templates/login.html', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('Error loading page');
            return;
        }

        const html = data.replace('{{captcha_code}}', captcha.image);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    });
};

const handleLogin = (req, res) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
        const data = querystring.parse(body);
        const { email, password, captcha } = data;

        if (!utils.validateEmail(email)) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('Invalid email format.');
            return;
        }

        if (captcha !== global.captchaCode) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('CAPTCHA mismatch. Please try again.');
            return;
        }

        db.executeQuery(
            'SELECT * FROM users WHERE email = ?',
            [email],
            (users) => {
                if (users.length === 0) {
                    res.writeHead(400, { 'Content-Type': 'text/html' });
                    res.end('Invalid email or password');
                    return;
                }

                const user = users[0];

                if (user && utils.comparePasswords(password, user.password)) {
                    currentUser = user;
                    global.captchaCode = null; 
                    serveHomePage(res, currentUser);
                } else {
                    res.writeHead(400, { 'Content-Type': 'text/html' });
                    res.end('Invalid email or password');
                }
            }
        );
    });
};


const serveChangeProfilePage = (req, res) => {
    if (!currentUser) {
        res.writeHead(401, { 'Content-Type': 'text/html' });
        res.end('You must be logged in to change your profile.');
        return;
    }

    fs.readFile('./templates/change-profile.html', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('Error loading page');
            return;
        }

        const html = data.replace('{{firstName}}', currentUser.firstName || '')
                         .replace('{{lastName}}', currentUser.lastName || '')
                         .replace('{{email}}', currentUser.email || '');

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    });
};

const handleProfileUpdate = (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', () => {
        const data = querystring.parse(body);
        const { firstName, lastName, email, password, confirmPassword } = data;

        if (!currentUser) {
            res.writeHead(401, { 'Content-Type': 'text/html' });
            res.end('You must be logged in to change your profile.');
            return;
        }

        if (!firstName || !lastName || !email) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('First name, last name, and email are required.');
            return;
        }

        if (password && password !== confirmPassword) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('Passwords do not match.');
            return;
        }

        let updatedPassword = currentUser.password;
        if (password) {
            updatedPassword = utils.hashPassword(password);
        }

        db.executeQuery(
            'UPDATE users SET firstName = ?, lastName = ?, email = ?, password = ? WHERE id = ?',
            [firstName, lastName, email, updatedPassword, currentUser.id],
            (result) => {
                if (result.affectedRows > 0) {
                    currentUser.firstName = firstName;
                    currentUser.lastName = lastName;
                    currentUser.email = email;
                    currentUser.password = updatedPassword;

                    serveHomePage(res, currentUser);
                } else {
                    res.writeHead(400, { 'Content-Type': 'text/html' });
                    res.end('Failed to update profile.');
                }
            }
        );
    });
};

const handleLogout = (res) => {
    if (currentUser === null) {
        res.writeHead(401, { 'Content-Type': 'text/html' });
        res.end('You are not logged in yet!');
        return;
    }

    currentUser = null;
    serveHomePage(res);
};

const serve404Page = (res) => {
    fs.readFile('./templates/404.html', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('Error loading page');
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}

server.listen(3030, () => console.log('Server running on http://localhost:3030'));