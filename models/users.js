const Promise = require("bluebird");
const { isValidUser, generateHash } = require("../lib/userAuthentication");
const { _usersSchema } = require("../lib/db");

exports.authenticateUser = function () {
    return new Promise((resolve, reject) => {
        isValidUser(this).then(response => {
            resolve({ authentication: response });
        })
        .catch(err => {
            reject(err);
        });
    })
}

exports.registerUser = function () {
    return new Promise((resolve, reject) => {
        isValidUser(this).then(response => {
            reject({ code: 1005, msg: "User Already Exists" });
        })
        .catch(err => {
            if(err.code === 1001) {
                generateHash(this.password).then(hash => {
                    this.pwd = hash;
                    let user = new _usersSchema(this);
                    user.save(function (err, res) {
                        if (err) {
                            reject(err);
                        }
                        resolve(res);
                    });
                })
                .catch(err => err);                
            } else {
                reject(err);
            }
        });
    })
}