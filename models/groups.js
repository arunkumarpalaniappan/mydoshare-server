const {
    _usersSchema,
    _groupsSchema,
    _customSchema
} = require("../lib/db");
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
                        reject(err);
                    }
                    this.id = res._id;
                    exports.createGroupExpenses.call(this).then(exp => {
                            exports.joinUsertoGroup.call({user_id: this.user._id, grp_id: this.id})
                            .then(addusr => {
                                resolve(addusr);
                            })
                            .catch(addusrerr => {
                                reject(addusrerr);
                            });
                        })
                        .catch(err => {
                            reject(err);
                        });
                });
            } else {
                reject({
                    code: 1006,
                    msg: "Group already exists."
                });
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
                reject({
                    code: 1007,
                    msg: "Group doesn't exists."
                })
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
                _groupsSchema.update({
                        _id: this._id
                    }, {
                        $set: {
                            users: [...grp[0].users, ...this.users].filter(onlyUnique)
                        }
                    })
                    .then(res => resolve(res))
                    .catch(err => reject(err));
            } else {
                reject({
                    code: 1007,
                    msg: "Group doesn't exists."
                })
            }
        });
    })
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
                        console.log(err)
                        reject(err);
                    }
                    resolve(res);
                });
            } else {
                reject({
                    code: 1008,
                    msg: "Group already exists"
                });
            }
        });
    })
}

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
                                    grp[0].users = this.user_id;
                                    _groupsSchema.update({
                                            _id: this.grp_id
                                        }, {
                                            $set: {
                                                users: grp[0].users.filter(onlyUnique)
                                            }
                                        })
                                        .then(grpresp => {
                                            const customSchema = _customSchema(this.grp_id);
                                            const newAddition = {
                                            } ;
                                            newAddition[`${this.user_id}_exp`] = [];
                                            newAddition[`${this.user_id}_paid`] = [];
                                            const paidName = `${this.user_id}_paid`;
                                            customSchema.update({}, newAddition, { multi: true })
                                                .then(schemaresp => {
                                                    resolve(schemaresp);
                                                })
                                                .catch(schemaerr => {
                                                    reject(schemaerr);
                                                })
                                        })
                                        .catch(grperr => {
                                            reject(grperr);
                                        })
                                } else {
                                    reject({
                                        code: 1007,
                                        msg: "Group doesn't exists."
                                    })
                                }
                            });
                        })
                        .catch(err => {
                            reject(err)
                        });
                } else {
                    reject({
                        code: 1001,
                        msg: "Invalid User"
                    })
                }
            })
            .catch(usrerr => reject(usrerr));
    });
}