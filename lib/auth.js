const bcrypt = require('bcryptjs');
const config = require('config');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const { errorCodes } = require("./statusCodes");
const Authenticate = (function () {
    const generatePassword = function () {
        let user = this;
        return new Promise(function (resolve, reject) {
            return bcrypt.hash(user.password, 10, function (err, hash) {
                if (err) {
                    return reject(errorCodes.hashFailed.code);
                } else {
                    return resolve(hash);
                }
            })
        })
    };
    const validatePassword = function () {
        let user = this;
        return new Promise(function (resolve, reject) {
            bcrypt.compare(user.password, user.hash, function (err, hash) {
                if (err) {
                    reject(errorCodes.hashComparisionFailed.code);
                } else {
                    if(hash) {
                        resolve(true);
                    } else {
                        reject(hash)
                    }                    
                }
            })
        })
    };
    const generateToken = function () {
        let user = this;
        return new Promise(function (resolve, reject) {
            return jwt.sign(user, config.get('jwt.key'), {algorithm: config.get('jwt.alg'), expiresIn: config.get('jwt.expires')}, function (err, token) {
                if (err) {
                    return reject(errorCodes.hashGenerationFailed.code);
                } else {
                    return resolve(token);
                }
            });
        });
    };
    const decodeToken = function () {
        let user = this;
        return new Promise(function (resolve,reject) {
            return jwt.verify(user,config.get('jwt.key'), function (err, decoded) {
                if (err) {
                    return reject(errorCodes.hashDecodeFailed.code);
                }
                resolve(decoded);
            })
        })
    };
    const authAPI = {
        generate: generatePassword,
        verify: validatePassword,
        token: generateToken,
        user: decodeToken
    };
    return authAPI;
})();

exports.methods = Authenticate;