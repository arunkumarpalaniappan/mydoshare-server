const Promise = require("bluebird");
const { _usersSchema } = require("./db");
const auth = require("./auth");

exports.isValidUser = (payload) => {
    return new Promise((resolve, reject) => {
        _usersSchema.find({ email: payload.email }).then(user => {
            if (user.length) {
                user = user[0];
                auth.methods.verify.call({ password: payload.password, hash: user.pwd }).then(res => {
                    auth.methods.token.call({ _id: user._id, email: user.email, name: user.name, verified: user.verified, password: user.pwd }).then(token => {
                        resolve({ code: 2001, login: true, token });
                    }).catch(err => {
                        reject({ code: 1003, msg: err });
                    })
                })
                    .catch(err => {
                        reject({ code: 1002, msg: 'Invalid Password' });
                    })
            } else {
                reject({ code: 1001, msg: 'Invalid User' });
            }
        }).catch(err => {
            reject({ code: 1004, msg: err });
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
                reject({ code: 1001, msg: 'Invalid User' });
            }
        }).catch(err => {
            reject({ code: 1004, msg: err });
        });
    });
}