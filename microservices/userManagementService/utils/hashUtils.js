const bcrypt = require('bcrypt');

module.exports.hashPassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return reject('Error hashing password');
            }
            resolve(hashedPassword);
        });
    });
};
