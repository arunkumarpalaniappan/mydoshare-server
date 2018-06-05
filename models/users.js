const Promise = require("bluebird");
const { isValidUser, generateHash } = require("../lib/userAuthentication");
const { sendVerification, sendInvite, sendWelcome } = require("../lib/email");
const { _usersSchema } = require("../lib/db");
const config = require("config");
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
                    user.save( (err, res) => {
                        if (err) {
                            reject(err);
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
                    reject({code: 1009, msg: 'Invalid Link'});
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
                            .then(res => resolve({code: 2002, msg: 'User Verified'}))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
                    }
                } else {
                    reject({ code: 1001, msg: 'Invalid User' });
                }
            })
            .catch(err => reject(err));
    });
};

exports.inviteUser = function() {
    return new Promise((resolve,reject) => {
        _usersSchema.find({_id: this.email}).then(usr => {
            if (!usr.length) {
                    const signedUrl = `http://${config.email.url}/signup/${atob(this.email+'_mds_'+this.grp_id)}`;
                    sendInvite.call({email : this.email, signedUrl, invitee: this.user.name})
                    .then(res => resolve(res))
                    .catch(err => reject(err));
                } else {
                    reject({ code: 1005, msg: 'User already exists' });
                }
            })
            .catch(err => reject(err));
    });
}