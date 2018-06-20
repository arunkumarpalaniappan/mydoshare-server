const {
    _usersSchema,
    _groupsSchema,
    _customSchema
} = require("../lib/db");
const { errorCodes, successCodes } = require("../lib/statusCodes");
const onlyUnique = (value, index, self) => self.indexOf(value) === index;
exports.create = function () {
    return new Promise((resolve, reject) => {
        _groupsSchema.find({
            name: this.name
        }).then(grp => {
            if (!grp.length) {
                let group = new _groupsSchema({
                    name: this.name
                });
                group.save((err, res) => {
                    if (err) {
                        reject(errorCodes.dbSaveFailed.code);
                    }
                    this.id = res._id;
                    exports.joinUsertoGroup.call({
                        user_id: this.user._id,
                        grp_id: this.id
                    })
                        .then(addusr => {
                            resolve(addusr);
                        })
                        .catch(addusrerr => {
                            reject(addusrerr);
                        });
                });
            } else {
                reject(errorCodes.groupExists.code);
            }
        })
    })
};

exports.get = function () {
    return new Promise((resolve, reject) => {
        _groupsSchema.find({
            _id: this.id
        }).then(grp => {
            if (grp.length) {
                resolve(grp[0].users);
            } else {
                reject(errorCodes.invalidGroup.code)
            }
        });
    })
};

exports.update = function () {
    return new Promise((resolve, reject) => {
        _groupsSchema.find({
            _id: this._id
        }).then(grp => {
            if (grp.length) {
                exports.joinUsertoGroup.call({
                    user_id: this.user,
                    grp_id: this._id
                })
                    .then(res => resolve(res))
                    .catch(err => reject(err));
            } else {
                reject(errorCodes.invalidGroup.code);
            }
        });
    });
};

exports.createGroupExpenses = function () {
    return new Promise((resolve, reject) => {
        const customSchema = _customSchema(this.id)
        customSchema.find({
            name: this.name
        }).then(group => {
            if (!group.length) {
                let group = new customSchema({
                    name: this.name
                });
                group.users = [this.user._id];
                group.save((err, res) => {
                    if (err) {
                        reject(errorCodes.dbSaveFailed.code);
                    }
                    resolve(successCodes.success.code);
                });
            } else {
                reject(errorCodes.groupExists.code);
            }
        });
    });
};

exports.joinUsertoGroup = function () {
    return new Promise((resolve, reject) => {
        _usersSchema.find({
            _id: this.user_id
        }).then(usr => {
            if (usr.length) {
                usr[0].grps[usr[0].grps.length] = this.grp_id;
                _usersSchema.update({
                    _id: this.user_id
                }, {
                        $set: {
                            grps: usr[0].grps.filter(onlyUnique)
                        }
                    })
                    .then(resp => {
                        _groupsSchema.find({
                            _id: this.grp_id
                        }).then(grp => {
                            if (grp.length) {
                                if (grp[0].users[this.user_id]) {
                                    reject(errorCodes.userAlreadyinGroup.code);
                                } else {
                                    const userGrp = {};
                                    userGrp[this.user_id] = usr[0].name;
                                    grp[0].users[grp[0].users.length] = userGrp
                                    _groupsSchema.update({
                                        _id: this.grp_id
                                    }, {
                                            $set: {
                                                users: grp[0].users
                                            }
                                        })
                                        .then(grpresp => {
                                            resolve(successCodes.success.code);
                                        })
                                        .catch(grperr => {
                                            reject(errorCodes.dbUpdateFailed.code);
                                        })
                                }
                            } else {
                                reject(errorCodes.invalidGroup.code);
                            }
                        });
                    })
                    .catch(err => {
                        reject(errorCodes.dbUpdateFailed.code)
                    });
            } else {
                reject(errorCodes.invalidUser.code)
            }
        })
            .catch(usrerr => reject(errorCodes.dbFindFailed.code));
    });
};

exports.remove = function () {
    return new Promise((resolve, reject) => {
        _groupsSchema.find({
            _id: this._id
        }).then(grp => {
            if (grp.length) {
                _usersSchema.find({
                    _id: this.user
                }).then(usr => {
                    if (usr.length) {
                        const grpindex = usr[0].grps.indexOf(this._id);
                        if (grpindex > -1) {
                            usr[0].grps.splice(grpindex, 1);
                        }
                        _usersSchema.update({
                            _id: this.user
                        }, {
                                $set: {
                                    grps: usr[0].grps.filter(onlyUnique)
                                }
                            })
                            .then(resp => {
                                _groupsSchema.find({
                                    _id: this._id
                                }).then(grp => {
                                    if (grp.length) {
                                        let updatedUser = [];
                                        grp[0].users.map(iUsr => {
                                            if (!Object.keys(iUsr).includes(this.user)) {
                                                updatedUser[updatedUser.length] = iUsr;
                                            }
                                        })
                                        _groupsSchema.update({
                                            _id: this._id
                                        }, {
                                                $set: {
                                                    users: updatedUser
                                                }
                                            })
                                            .then(grpresp => {
                                                resolve(successCodes.success.code);
                                            })
                                            .catch(grperr => {
                                                reject(errorCodes.dbUpdateFailed.code);
                                            })
                                    } else {
                                        reject(errorCodes.invalidGroup.code);
                                    }
                                });
                            })
                            .catch(err => {
                                reject(errorCodes.dbUpdateFailed.code)
                            });
                    } else {
                        reject(errorCodes.invalidUser.code);
                    }
                })
                    .catch(usrerr => reject(errorCodes.dbFindFailed.code));
            } else {
                reject(errorCodes.invalidGroup.code);
            }
        });
    });
};

