const bcrypt = require('bcryptjs');
const config = require('config');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const Authenticate = (function () {
    const generatePassword = function () {
        let user = this;
        return new Promise(function (resolve, reject) {
            return bcrypt.hash(user.password, 10, function (err, hash) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(hash);
                }
            })
        })
    };
    const validatePassword = function () {
        let user = this;
        return new Promise(function (resolve, reject) {
            return bcrypt.compare(user.password, user.hash, function (err, hash) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(hash);
                }
            })
        })
    };
    const generateToken = function () {
        let user = this;
        return new Promise(function (resolve, reject) {
            return jwt.sign(user, config.get('jwt.key'), {algorithm: config.get('jwt.alg')}, function (err, token) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(token);
                }
            });
        });
    };
    const authAPI = {
        generate: generatePassword,
        verify: validatePassword,
        token: generateToken,
    };
    return authAPI;
})();

exports.auth = Authenticate;