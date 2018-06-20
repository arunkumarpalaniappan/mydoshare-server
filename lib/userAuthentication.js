const Promise = require("bluebird");
const { _usersSchema } = require("./db");
const auth = require("./auth");
const { errorCodes, successCodes } = require("./statusCodes");

exports.isValidUser = (payload) => {
    return new Promise((resolve, reject) => {
        _usersSchema.find({ email: payload.email }).then(user => {
            if (user.length) {
                user = user[0];
                auth.methods.verify.call({ password: payload.password, hash: user.pwd }).then(res => {
                    auth.methods.token.call({ _id: user._id, email: user.email, name: user.name, verified: user.verified, password: user.pwd }).then(token => {
                        resolve({ code: successCodes.userLoggedIn.code, login: true, token });
                    }).catch(err => {
                        reject(err);
                    })
                })
                    .catch(err => {
                        reject(errorCodes.invalidPassword.code);
                    })
            } else {
                reject(errorCodes.invalidUser.code);
            }
        }).catch(err => {
            reject(errorCodes.dbFindFailed.code);
        });
    });
}

exports.generateHash = (pwd) => {
    return auth.methods.generate.call({ password: pwd })
        .then(token => token)
        .catch(err => err);
}

exports.validateUser = payload => {
    return new Promise((resolve, reject) => {
        _usersSchema.find({ email: payload.email, pwd: payload.password }).then(user => {
            if (user.length) {
                    resolve(user);
                } else {
                reject(errorCodes.invalidUser.code);
            }
        }).catch(err => {
            reject(err);
        });
    });
}