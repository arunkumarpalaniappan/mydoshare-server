const {
    _customSchema,
    _usersSchema
} = require("../lib/db");
const { errorCodes, successCodes } = require("../lib/statusCodes");
exports.create = function () {
    return new Promise((resolve, reject) => {
        const grpSchema = _customSchema(this._id);
        let group = {};
        group.name = this.payload.name;
        group.category = this.payload.category;
        group.paidBy = []
        this.payload.expenses.map(userExp => {
            let key = Object.keys(userExp)[0];
            group[`${key}_exp`] = userExp[key].exp;
            group[`${key}_paid`] = userExp[key].paid;
            if(userExp[key].paid) {
                group.paidBy.push(key);
            }
            if(userExp[key].exp) {
                _usersSchema.find({_id: key}).then(usr => {
                    if (usr.length) {
                        usr[0].notifications.push(`${this.payload.name} was created by ${this.payload.user.name}`)
                            _usersSchema.update({
                                _id: key
                            }, {
                                $set: {
                                    notifications: usr[0].notifications 
                                }
                            })
                            .then(resp => {
                                console.log(resp);
                            })
                            .catch(err => console.log(err));
                                }
                    })
                    .catch(err => console.log(err));
            }
        });
        grpSchema.create(group).then(group => {
            resolve(successCodes.success.code);
        }).catch(err => {
            reject(err);
        })
    });
};

exports.get = function () {
    return new Promise((resolve, reject) => {
        const grpSchema = _customSchema(this.id)
        grpSchema.find({}).then(grp => {
            if (grp.length) {
                resolve(grp);
            } else {
                reject(errorCodes.invalidPassword.code)
            }
        });
    });
};

exports.update = function () {
    return new Promise((resolve, reject) => {
        const grpSchema = _customSchema(this._id);
        let group = {};
        group.name = this.payload.name;
        group.category = this.payload.category;
        group.paidBy = []
        this.payload.expenses.map(userExp => {
            let key = Object.keys(userExp)[0];
            group[`${key}_exp`] = userExp[key].exp;
            group[`${key}_paid`] = userExp[key].paid;
            if(userExp[key].paid) {
                group.paidBy.push(key);
            }
            if(userExp[key].exp) {
                _usersSchema.find({_id: key}).then(usr => {
                    if (usr.length) {
                        usr[0].notifications.push(`${this.payload.name} was updated by ${this.payload.user.name}`)
                            _usersSchema.update({
                                _id: key
                            }, {
                                $set: {
                                    notifications: usr[0].notifications 
                                }
                            })
                            .then(resp => {
                                console.log(resp);
                            })
                            .catch(err => console.log(err));
                                }
                    })
                    .catch(err => console.log(err));
            }
        });
        grpSchema.find({_id: this.exp}).then(exp => {
            if (exp.length) {
               if(exp[0].paidBy.includes(this.payload.user._id)) {
                    grpSchema.updateOne({_id: this.exp},group).then(group => {
                        resolve(successCodes.success.code);
                    }).catch(err => {
                        console.log(err);
                        reject(err);
                    });
               } else {
                reject(errorCodes.userNotAuthorized.code);
               }
            } else {
                reject(errorCodes.invalidGroup.code);
            }
        })
        .catch(err => {
            console.log(err);
        });
    });
};
exports.delete = function () {
    return new Promise((resolve, reject) => {
        const grpSchema = _customSchema(this._id)
        grpSchema.find({}).then(grp => {
            if (grp.length) {
                grpSchema.find({_id: this.exp}).then(exp => {
                    if (exp.length) {
                       if(exp[0].paidBy.includes(this.payload.user._id)) {
                        Object.keys(JSON.parse((JSON.stringify(exp[0])))).map(user => {
                               if(user.includes('_exp')) {
                                   let userId = user.replace('_exp','');
                                   console.log(userId);
                                   _usersSchema.find({_id: userId}).then(usr => {
                                    if (usr.length) {
                                        console.log(usr)
                                        usr[0].notifications.push(`${exp[0].name} was deleted by ${this.payload.user.name}`)
                                            _usersSchema.update({
                                                _id: userId
                                            }, {
                                                $set: {
                                                    notifications: usr[0].notifications 
                                                }
                                            })
                                            .then(resp => {
                                                console.log(resp);
                                            })
                                            .catch(err => console.log(err));
                                                }
                                    })
                                    .catch(err => console.log(err));
                               }
                           })
                            grpSchema.deleteOne({_id: this.exp}).then(group => {
                                resolve(successCodes.success.code);
                            }).catch(err => {
                                console.log(err);
                                reject(err);
                            });
                       } else {
                        reject(errorCodes.userNotAuthorized.code);
                       }
                    } else {
                        reject(errorCodes.invalidGroup.code);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            } else {
                reject(errorCodes.invalidGroup.code)
            }
        });
    });
}