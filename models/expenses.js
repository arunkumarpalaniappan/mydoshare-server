const {
    _customSchema
} = require("../lib/db");

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
        });
        grpSchema.create(group).then(group => {
            resolve(group);
        }).catch(err => {
            console.log(err);
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
                reject({
                    code: 1007,
                    msg: "Group doesn't exists."
                })
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
        });
        grpSchema.find({_id: this.exp}).then(exp => {
            if (exp.length) {
               if(exp[0].paidBy.includes(this.payload.user._id)) {
                    grpSchema.updateOne({_id: this.exp},group).then(group => {
                        resolve({code: 1011, msg: 'Success'});
                    }).catch(err => {
                        console.log(err);
                        reject(err);
                    });
               } else {
                reject({
                    code: 1010,
                    msg: "User not authorized to perform edit on this record."
                });
               }
            } else {
                reject({
                    code: 1012,
                    msg: "Expense doesn't exists."
                });
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
                            grpSchema.deleteOne({_id: this.exp}).then(group => {
                                resolve({code: 1012, msg: 'Success'});
                            }).catch(err => {
                                console.log(err);
                                reject(err);
                            });
                       } else {
                        reject({
                            code: 1010,
                            msg: "User not authorized to perform edit on this record."
                        });
                       }
                    } else {
                        reject({
                            code: 1012,
                            msg: "Expense doesn't exists."
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            } else {
                reject({
                    code: 1007,
                    msg: "Group doesn't exists."
                })
            }
        });
    });
}