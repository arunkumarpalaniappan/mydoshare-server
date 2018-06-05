const {
    _customSchema
} = require("../lib/db");

exports.create = function () {
    return new Promise((resolve, reject) => {
        const customSchema = _customSchema(this.id)
        customSchema.find({
            _id: this.id
        }).then(group => {
            if (group.length) {
                for(user in this.expenses) {
                    group[user] = this.expenses[user];
                }
                group.save((err, res) => {
                    if (err) {
                        console.log(err)
                        reject(err);
                    }
                    resolve(res);
                });
            } else {
                reject({
                    code: 1007,
                    msg: "Group doesn't exists"
                });
            }
        });
    });
};