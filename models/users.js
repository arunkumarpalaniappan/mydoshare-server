const Promise = require("bluebird");
const { isValidUser, generateHash } = require("../lib/userAuthentication");
const { sendVerification, sendInvite, sendWelcome, sendReset } = require("../lib/email");
const { _usersSchema } = require("../lib/db");
const config = require("config");
const { errorCodes, successCodes } = require("../lib/statusCodes");
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
            reject(errorCodes.userExists.code);
        })
        .catch(err => {
            if(err === 1001) {
                generateHash(this.password).then(hash => {
                    this.pwd = hash;
                    let user = new _usersSchema(this);
                    user.save( (err, res) => {
                        if (err) {
                            reject(errorCodes.dbSaveFailed.code);
                        }
                        const signedUrl = `http://${config.email.url}/verify/${res._id}`;
                        sendVerification.call({email : res.email, signedUrl})
                        .then(res => resolve(res))
                        .catch(err => reject(err));
                    });
                })
                .catch(err => err);                
            } else {
                reject(err);
            }
        });
    })
}

exports.verify = function() {
    return new Promise((resolve,reject) => {
        _usersSchema.find({_id: this.id}).then(usr => {
            if (usr.length) {
                if(usr[0].verified) {
                    reject(errorCodes.invalidLink.code);
                } else {
                    _usersSchema.update({
                        _id: usr[0]._id
                    }, {
                        $set: {
                            verified: true
                        }
                    })
                    .then(resp => {
                        sendWelcome.call({email: usr[0].email, name: usr[0].name})
                            .then(res => resolve(successCodes.userVerified.code))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(errorCodes.dbUpdateFailed.code));
                    }
                } else {
                    reject(errorCodes.invalidUser.code);
                }
            })
            .catch(err => reject(errorCodes.dbFindFailed.code));
    });
};

exports.inviteUser = function() {
    return new Promise((resolve,reject) => {
        _usersSchema.find({email: this.email}).then(usr => {
            if (!usr.length) {
                    const signedUrl = `http://${config.email.url}/signup/${atob(this.email+'_mds_'+this.grp_id)}`;
                    sendInvite.call({email : this.email, signedUrl, invitee: this.user.name})
                    .then(res => resolve(res))
                    .catch(err => reject(err));
                } else {
                    reject(errorCodes.userExists.code);
                }
            })
            .catch(err => reject(errorCodes.dbFindFailed.code));
    });
}

exports.resetPassword = function() {
    return new Promise((resolve, reject) => {
        _usersSchema.find({email: this.email}).then(usr => {
            if(usr.length){
                const uniqueResetHash = usr[0].id + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                _usersSchema.update({
                    _id: usr[0]._id
                }, {
                    $set: {
                        passwordReset: uniqueResetHash
                    }
                })
                .then(resp => {
                    const signedUrl = `http://${config.email.url}/reset/${uniqueResetHash}`;
                    sendReset.call({email: usr[0].email, signedUrl})
                        .then(res => resolve(successCodes.resetEmailSent.code))
                        .catch(err => reject(err));
                })
                .catch(err => reject(errorCodes.dbUpdateFailed.code));
            } else {
                reject(errorCodes.invalidUser.code);
            }
        })
        .catch(err => reject(errorCodes.dbFindFailed.code));
    });
};

exports.getNotifications = function () {
    return new Promise((resolve, reject) => {
        _usersSchema.find({
            _id: this.user._id
        }).then(usr => {
            if (usr.length) {
                resolve(usr[0].notifications);
            } else {
                reject(errorCodes.invalidUser.code)
            }
        });
    })
};

exports.deleteNotification = function () {
    return new Promise((resolve, reject) => {
        _usersSchema.find({
            _id: this.user._id
        }).then(usr => {
            if (usr.length) {
                usr[0].notifications.splice(this.index, 1);
                console.log(usr[0].notifications)
                _usersSchema.update({
                    _id: this.user._id
                }, {
                    $set: {
                        notifications: usr[0].notifications
                    }
                })
                .then(resp => {
                    resolve(successCodes.deleteNotification.code)
                })
                .catch(err => reject(errorCodes.dbUpdateFailed.code));
            } else {
                reject(errorCodes.invalidUser.code);
            }
        });
    })
};