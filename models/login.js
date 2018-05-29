const Promise = require("bluebird");
const {isValidUser}  = require("../lib/userAuthentication");
exports.authenticateUser = () => {
    return new Promise((resolve,reject) => {
        isValidUser(this).then(response => {
            resolve({authentication: response})
        })
        .catch(err => {
            reject(err);
        });
    })
}