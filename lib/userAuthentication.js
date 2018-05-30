const Promise = require("bluebird");
const { _usersSchema } = require("./db");
const auth = require("./auth");

exports.isValidUser = (payload) => {
    return new Promise((resolve, reject) => {
        _usersSchema.find({ email: payload.email }).then(user => {
            if (user.length) {
                auth.methods.verify.call({ password: payload.password, hash: user[0].pwd }).then(res => {
                    auth.methods.token.call({ email: user.email, name: user.email, verified: user.verified }).then(token => {
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
        })
    })
}

exports.generateHash = (pwd) => {
    return auth.methods.generate.call({ password: pwd })
        .then(token => token)
        .catch(err => err);
}