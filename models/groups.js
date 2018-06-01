
const {_groupsSchema,_customSchema} = require("../lib/db");
exports.create = function () {
    return new Promise((resolve,reject) => {
        _groupsSchema.find({name: this.name}).then(grp => {
            if(!grp.length) {
                let group = new _groupsSchema(this.name);
                group.save((err, res) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    exports.createGroupExpenses.call(this).then(exp => {
                        resolve(exp)
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    })
                });
            } else {
                reject({code: 1006, msg: "Group already exists."});
            }
        })
    })
};

exports.get = function () {
    return new Promise((resolve,reject) => {
        _groupsSchema.find({_id: this.id}).then(grp => {
            if(grp.length) {
                resolve(grp[0].users);
            } else {
                reject({code: 1007, msg: "Group doesn't exists."})
            }
        });
    })
};

exports.update = function () {
    return new Promise((resolve,reject) => {
        _groupsSchema.find({_id: this._id}).then(grp => {
            if(grp.length) {
                _groupsSchema.update({ _id: this._id }, { $set: { users: [...grp[0].users, ...this.users] }})
                .then(res => resolve(res))
                .catch(err => reject(err));
            } else {
                reject({code: 1007, msg: "Group doesn't exists."})
            }
        });
    })
};

exports.createGroupExpenses = function () {
    return new Promise((resolve,reject) => {
        console.log(this.name)
        const customSchema = _customSchema(this.name)
        customSchema.find({name: this.name}).then(group => {
            if(!group.length) {
                console.log(this)
                let group = new customSchema(this.name);
                group.users = [payload.user._id];
                group.save((err, res) => {
                    if (err) {
                        console.log(err)
                        reject(err);
                    }
                    resolve(res);
                });
            } else {
                reject({code: 1008, msg: "Group already exists"});
            }
        })
    })
}